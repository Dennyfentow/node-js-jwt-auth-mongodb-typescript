const dotenv = require("dotenv");
dotenv.config({
  path: "./app.env"
});
module.exports = {
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    DB: process.env.DB_NAME,
    USER: process.env.MONGODB_USERNAME,
    PASSWORD: process.env.MONGODB_PASSWORD
};
