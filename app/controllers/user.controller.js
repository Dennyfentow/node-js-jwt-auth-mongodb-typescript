exports.allAccess = (req, res) => {
    res.status(200).send("Conteúdo Público.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("Conteúdo de Usuário.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Conteúdo de Administrador.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Conteúdo de Moderador.");
};