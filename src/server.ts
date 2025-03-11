import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './models';
import dbConfig from './config/db.config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

dotenv.config({
  path: "./app.env"
});

const app: Express = express();

const corsOptions = {
  origin: ["http://localhost:4200", "http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Access-Token'],
  exposedHeaders: ['Content-Length', 'Authorization']
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
authRoutes(app);
userRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      try {
        await new Role({
          name: "user"
        }).save();
        console.log("added 'user' to roles collection");

        await new Role({
          name: "moderator"
        }).save();
        console.log("added 'moderator' to roles collection");

        await new Role({
          name: "admin"
        }).save();
        console.log("added 'admin' to roles collection");
      } catch (err) {
        console.log("error", err);
      }
    }
  } catch (err) {
    console.error("Error initializing roles", err);
  }
} 