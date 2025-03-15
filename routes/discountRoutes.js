const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discountController");

// Endpoint POST per verificare/inserire l'email
router.post("/verify-email", discountController.verifyEmail);

module.exports = router;

