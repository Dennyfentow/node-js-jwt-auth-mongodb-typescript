const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({
  path: "./app.env"
});

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
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
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

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