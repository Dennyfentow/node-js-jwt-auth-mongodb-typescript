import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authConfig from '../config/auth.config';
import db from '../models';
import { IUser } from '../models/interfaces/user.interface';

const User = db.user;
const Role = db.role;

/**
 * Função auxiliar para obter o token de acesso a partir dos cabeçalhos da requisição
 * Suporta diferentes formatos de cabeçalho (case-insensitive)
 */
const getTokenFromHeaders = (req: Request): string | null => {
  // Obter o valor do cabeçalho
  const tokenHeader = 
    req.headers["x-access-token"] as string || 
    req.headers["X-Access-Token"] as string;
  
  // Se for string, retornar a própria string
  return tokenHeader || null;
};

/**
 * Gera o token JWT e formata a resposta com os dados do usuário
 * @param user Usuário autenticado
 * @param token Token JWT (opcional, será gerado se não fornecido)
 * @param message Mensagem adicional para incluir na resposta (opcional)
 */
const formatUserResponse = (
  user: IUser, 
  token?: string, 
  message?: string
): Record<string, any> => {
  // Gerar token JWT se não fornecido
  const accessToken = token || jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: 86400 // 24 horas
  });
  
  // Montar as autoridades/roles
  const authorities = [];
  if (Array.isArray(user.roles)) {
    for (let i = 0; i < user.roles.length; i++) {
      const role = user.roles[i] as any;
      if (role.name) {
        authorities.push("ROLE_" + role.name.toUpperCase());
      }
    }
  }
  
  // Formatar resposta
  const response: Record<string, any> = {
    id: user._id,
    username: user.username,
    email: user.email,
    roles: authorities,
    accessToken: accessToken,
    name: user.name,
    institution: user.institution,
    department: user.department,
    terms_accepted: user.terms_accepted,
    results: user.results,
    result_simulator: user.result_simulator,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
  
  // Adicionar mensagem se fornecida
  if (message) {
    response.message = message;
  }
  
  return response;
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      name: req.body.name,
      institution: req.body.institution,
      department: req.body.department,
      terms_accepted: req.body.terms_accepted || false,
      results: req.body.results,
      result_simulator: req.body.result_simulator,
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true,
      last_login: new Date()
    });

    await user.save();

    if (req.body.roles) {
      const roles = await Role.find({
        name: { $in: req.body.roles }
      });

      user.roles = roles.map(role => role._id as any);
      await user.save();
    } else {
      const role = await Role.findOne({ name: "user" });
      
      if (!role) {
        res.status(500).send({ message: "Role 'user' não encontrada!" });
        return;
      }
      
      user.roles = [role._id as any];
      await user.save();
    }
    
    // Buscar o usuário com as roles populadas para gerar o token
    const populatedUser = await User.findById(user._id).populate("roles", "-__v");
    
    if (!populatedUser) {
      res.status(500).send({ message: "Erro ao buscar informações do usuário." });
      return;
    }
    
    // Gerar token JWT e formatar resposta
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400 // 24 horas
    });
    
    const responseData = formatUserResponse(
      populatedUser, 
      token, 
      "Usuário registrado com sucesso!"
    );
    
    res.status(200).send(responseData);
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({
      username: req.body.username
    }).populate("roles", "-__v");

    if (!user) {
      res.status(404).send({ message: "Usuário não encontrado." });
      return;
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      res.status(401).send({
        accessToken: null,
        message: "Senha inválida!"
      });
      return;
    }

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400 // 24 horas
    });
    
    const responseData = formatUserResponse(user, token);
    res.status(200).send(responseData);
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

export const verify = async (req: Request, res: Response): Promise<void> => {
  const token = getTokenFromHeaders(req);
  if (!token) {
    res.status(403).send({ message: "No token provided!" });
    return;
  }

  jwt.verify(token, authConfig.secret, async (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Unauthorized!" });
      return;
    }

    if(!decoded || typeof decoded === 'string') {
      res.status(401).send({ message: "Unauthorized!" });
      return;
    }
  
    try {
      const user = await User.findById(decoded.id).populate("roles", "-__v");
    
      if (!user) {
        res.status(401).send({ message: "Unauthorized!" });
        return;
      }
    
      res.status(200).send({
        message: "Token válido!"
      });
    } catch (err) {
      res.status(500).send({ message: (err as Error).message });
    }
  });
};

export const signout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "Deslogado com sucesso!" });
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};