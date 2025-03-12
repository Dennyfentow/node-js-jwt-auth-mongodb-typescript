import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config({ path: 'app.env' });


export const acceptTerms = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers["x-access-token"] as string;
  const decoded = jwt.verify(token, process.env['SECRET'] as string);
  
  if(typeof decoded === 'string') {
    res.status(401).send("Token inválido.");
    return;
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(404).send("Usuário não encontrado.");
    return;
  }

  if (user.terms_accepted) {
    res.status(204).send({
      message: "Termos de uso já aceitos."
    });
    return;
  }

  user.terms_accepted = true;
  await user.save();
  res.status(204).send({
    message: "Termos de uso aceitos."
  });
};

export const allAccess = (req: Request, res: Response): void => {
  res.status(200).send("Conteúdo Público.");
};

export const userBoard = (req: Request, res: Response): void => {
  res.status(200).send("Conteúdo de Usuário.");
};

export const adminBoard = (req: Request, res: Response): void => {
  res.status(200).send("Conteúdo de Administrador.");
};

export const moderatorBoard = (req: Request, res: Response): void => {
  res.status(200).send("Conteúdo de Moderador.");
}; 