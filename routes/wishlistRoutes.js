const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

router.post("/", wishlistController.addProductToWishlist);

router.delete("/", wishlistController.removeProductFromWishlist);

router.get("/", wishlistController.getWishlist);

module.exports = router;
