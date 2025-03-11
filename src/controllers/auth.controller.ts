import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authConfig from '../config/auth.config';
import db from '../models';

const User = db.user;
const Role = db.role;

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    await user.save();

    if (req.body.roles) {
      const roles = await Role.find({
        name: { $in: req.body.roles }
      });

      user.roles = roles.map(role => role._id as any);
      await user.save();
      
      res.send({ message: "Usuário registrado com sucesso!" });
    } else {
      const role = await Role.findOne({ name: "user" });
      
      if (!role) {
        res.status(500).send({ message: "Role 'user' não encontrada!" });
        return;
      }
      
      user.roles = [role._id as any];
      await user.save();
      
      res.send({ message: "Usuário registrado com sucesso!" });
    }
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

    const authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
      const role = user.roles[i] as any;
      authorities.push("ROLE_" + role.name.toUpperCase());
    }
    
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
}; 

export const signout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "Deslogado com sucesso!" });
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};