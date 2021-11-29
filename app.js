const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Thing = require("./models/Thing");

mongoose
  .connect(
    "mongodb+srv://shinboram-90:Hope8624@cluster0.txhyv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )

  //creer une variable dans le dossier .env
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(bodyParser.json());
// utiliser express.json();

app.post("/api/sauces", (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...res.body,
  });
  thing
    .save()
    .then(() => res.status(201).json({ message: "object saved" }))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/api/sauces", (req, res, next) => {
  const stuff = [
    {
      _id: "oeihfzeoi",
      title: "Mon premier objet",
      description: "Les infos de mon premier objet",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
      price: 4900,
      userId: "qsomihvqios",
    },
    {
      _id: "oeihfzeomoihi",
      title: "Mon deuxième objet",
      description: "Les infos de mon deuxième objet",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
      price: 2900,
      userId: "qsomihvqios",
    },
  ];
  res.status(200).json(stuff);
});

module.exports = app;
