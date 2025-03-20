const express = require("express");
const router = express.Router();

const {
  createCart,
  getCart,
  addToCart,
  removeFromCart,
  completeOrder,
} = require("../controllers/cartController");

// Rotta per creare un nuovo carrello
router.post("/create", createCart);

// Rotta per recuperare il carrello tramite cartId
router.get("/:cartId", getCart);

// Rotta per aggiungere un prodotto al carrello
router.post("/add", addToCart);

// Rotta per rimuovere un prodotto dal carrello
router.delete("/remove", removeFromCart);

// Rotta per completare l'ordine
router.post("/complete", completeOrder);

const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart);
router.delete("/remove/:id", cartController.removeFromCart);
router.get("/", cartController.getCart);


module.exports = router;
