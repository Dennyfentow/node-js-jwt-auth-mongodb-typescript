const dotenv = require("dotenv");
dotenv.config({
  path: "./app.env"
});

module.exports = {
    secret: process.env.SECRET
};