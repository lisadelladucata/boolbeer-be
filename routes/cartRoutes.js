const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart); // Aggiungi un articolo al carrello
router.delete("/remove/:id", cartController.removeFromCart); // Rimuovi un articolo dal carrello
router.get("/", cartController.getCart); // Ottieni il carrello

module.exports = router;
