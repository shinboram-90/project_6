const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: false },
  name: { type: String, required: false },
  manufacturer: { type: String, required: false },
  description: { type: String, required: false },
  mainPepper: { type: String, required: false },
  imageUrl: { type: String, required: false },
  heat: { type: Number, required: false },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: Array, default: [] },
  usersDisliked: { type: Array, default: [] },
});

module.exports = mongoose.model("Sauce", sauceSchema);
