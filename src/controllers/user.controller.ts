import { Request, Response } from 'express';

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