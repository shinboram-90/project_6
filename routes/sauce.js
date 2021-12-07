const express = require("express");
const router = express.Router();

// const auth = require("../middleware/auth");
// const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controllers/sauce");

// On appelle pas la fonction, juste creation de la route
router.get("/", sauceCtrl.getAllSauces);
router.get("/:id", sauceCtrl.getOneSauce);
router.post("/", sauceCtrl.createSauce);
router.put("/:id", sauceCtrl.modifySauce);
router.delete("/:id", sauceCtrl.deleteSauce);

module.exports = router;
