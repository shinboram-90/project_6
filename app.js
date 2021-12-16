const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// Robot tente le login en masse, au bout de 100 fois doit attendre
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(helmet());

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.MONGO_ACCESS}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Login to MongoDB successful!"))
  .catch((e) => console.log(e));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

// Renvoit les requetes dans la console
app.use(morgan("tiny"));

app.use(limiter);

// Tous les caracteres interdits sont remplaces par ce qu'il y a entre ""
app.use(mongoSanitize({ replaceWith: "_" }));

module.exports = app;
