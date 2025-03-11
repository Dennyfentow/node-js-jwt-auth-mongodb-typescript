const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Verificar username
    const userByUsername = await User.findOne({
      username: req.body.username
    });

    if (userByUsername) {
      return res.status(400).send({
        message: "Falha! Username já está em uso!"
      });
    }

    // Verificar email
    const userByEmail = await User.findOne({
      email: req.body.email
    });

    if (userByEmail) {
      return res.status(400).send({
        message: "Falha! Email já está em uso!"
      });
    }

    next();
  } catch (err) {
    res.status(500).send({
      message: "Ocorreu um erro ao verificar username/email"
    });
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).send({
          message: `Falha! Role ${req.body.roles[i]} não existe!`
        });
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;