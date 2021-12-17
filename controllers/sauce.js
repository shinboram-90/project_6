const Sauce = require("../models/Sauce");

// Avoir acces aux differentes operations liees au systeme de fichiers
const fs = require("fs");

//  CREATE ONE SAUCE
// Pour ajouter un fichier a la req, le front doit envoyer les donnees sous forme de data et non sous la forme JSON
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Sauce successfully created!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// READ LIST OF SAUCES
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// READ ONE SAUCE
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// UPDATE ONE SAUCE
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      return res.status(404).json({
        error: "Sauce not found",
      });
    }
    if (sauce.userId !== req.auth.userId) {
      return res.status(403).json({
        error: "Unauthorized request.",
      });
    }

    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    Sauce.updateOne(
      { _id: req.params.id },
      {
        ...sauceObject,
        _id: req.params.id,
      }
    )
      .then(() => {
        res.status(201).json({
          message: "Sauce successfully modified!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  });
};

// DELETE ONE SAUCE
// Avant la suppression, acceder au fichier pour pouvoir suppr l'image de la base
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: "Sauce not found",
        });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({
          error: "Unauthorized request.",
        });
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() =>
            res.status(200).json({ message: "Sauce successfully deleted!" })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// GIVE LIKES AND DISLIKES
exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  console.log({ like });

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const userLike = sauce.usersLiked.includes(userId);
      const userDislike = sauce.usersDisliked.includes(userId);

      switch (like) {
        // L'utilisateur annule son like ou son dislike
        case 0:
          if (userLike) {
            sauce.likes -= 1;
            sauce.usersLiked = sauce.usersLiked.filter((id) => id != userId);
          } else if (userDislike) {
            sauce.dislikes -= 1;
            sauce.usersDisliked = sauce.usersDisliked.filter(
              (id) => id != userId
            );
          }
          console.log(sauce.liked);
          console.log(sauce.usersDisliked);
          break;

        // L'utilisateur aime
        case 1:
          if (userLike) {
            error = "You already liked this sauce!";
          }
          if (userDislike) {
            error = "Cancel your dislike first and click on like again";
          }
          if (!userLike && !userDislike) {
            sauce.likes += 1;
            sauce.usersLiked.push(userId);
          }
          console.log({ userLike });
          console.log({ userDislike });

          break;

        // L'utilisateur n'aime pas
        case -1:
          if (!userDislike && !userLike) {
            sauce.dislikes += 1;
            sauce.usersDisliked.push(userId);
          }
          if (userDislike) {
            error = "You already disliked this sauce!";
          }
          if (userLike) {
            error = "Cancel your like first and hit the dislike button again";
          }
          console.log({ userLike });
          console.log({ userDislike });

          break;

        default:
          return res.status(400).json({ message: "Error, invalid request" });
      }

      sauce
        .save()
        .then(() =>
          res.status(201).json({ message: "Likes updated successfully" })
        )
        .catch((error) => {
          res.status(400).json({ error: error });
        });
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
