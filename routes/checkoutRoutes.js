// routes/checkoutRoutes.js
const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/checkoutController");

// Definisce l'endpoint per creare una sessione di checkout
router.post("/create-checkout-session", createCheckoutSession);

module.exports = router;
