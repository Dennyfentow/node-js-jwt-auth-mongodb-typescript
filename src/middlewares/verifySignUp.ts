import { Request, Response, NextFunction } from 'express';
import db from '../models';

const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    // Verificar username
    const userByUsername = await User.findOne({
      username: req.body.username
    });

    if (userByUsername) {
      res.status(400).send({
        message: "Falha! Username já está em uso!"
      });
      return;
    }

    // Verificar email
    const userByEmail = await User.findOne({
      email: req.body.email
    });

    if (userByEmail) {
      res.status(400).send({
        message: "Falha! Email já está em uso!"
      });
      return;
    }

    next();
  } catch (err) {
    res.status(500).send({
      message: "Ocorreu um erro ao verificar username/email"
    });
  }
};

const checkRolesExisted = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Falha! Role ${req.body.roles[i]} não existe!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

export default verifySignUp; 