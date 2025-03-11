export interface DbConfig {
  HOST: string;
  PORT: string;
  DB: string;
  USER: string;
  PASSWORD: string;
}

const dotenv = require("dotenv");
dotenv.config({
  path: "./app.env"
});

const dbConfig: DbConfig = {
  HOST: process.env.DB_HOST || "",
  PORT: process.env.DB_PORT || "",
  DB: process.env.DB_NAME || "",
  USER: process.env.MONGODB_USERNAME || "",
  PASSWORD: process.env.MONGODB_PASSWORD || ""
};

export default dbConfig; 