export interface AuthConfig {
  secret: string;
}

const dotenv = require("dotenv");
dotenv.config({
  path: "./app.env"
});

const authConfig: AuthConfig = {
  secret: process.env.SECRET || ""
};

export default authConfig; 