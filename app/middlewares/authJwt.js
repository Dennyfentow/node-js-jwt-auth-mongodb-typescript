const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "Nenhum token fornecido!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Não autorizado!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
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
    res.status(500).send({ message: err.message });
  }
};

isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
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
    res.status(500).send({ message: err.message });
  }
};

isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
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
    res.status(500).send({ message: err.message });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin
};
module.exports = authJwt;