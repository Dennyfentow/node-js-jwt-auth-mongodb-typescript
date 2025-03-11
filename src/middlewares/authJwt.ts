import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config';
import db from '../models';

const User = db.user;
const Role = db.role;

// Estendendo a interface Request para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers["x-access-token"] as string;

  if (!token) {
    res.status(403).send({ message: "Nenhum token fornecido!" });
    return;
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Não autorizado!" });
      return;
    }
    
    req.userId = (decoded as any).id;
    next();
  });
};

const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      res.status(404).send({ message: "Usuário não encontrado!" });
      return;
    }
    
    const roles = await Role.find({
      _id: { $in: user.roles }
    });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Requer Permissão de Administrador!" });
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

const isModerator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      res.status(404).send({ message: "Usuário não encontrado!" });
      return;
    }
    
    const roles = await Role.find({
      _id: { $in: user.roles }
    });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Requer Permissão de Moderador!" });
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

const isModeratorOrAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      res.status(404).send({ message: "Usuário não encontrado!" });
      return;
    }
    
    const roles = await Role.find({
      _id: { $in: user.roles }
    });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator" || roles[i].name === "admin") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Requer Permissão de Moderador ou Administrador!" });
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin
};

export default authJwt; 