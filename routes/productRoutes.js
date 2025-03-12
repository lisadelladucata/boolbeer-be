const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getProducts);

router.get("/category/:category_id", productController.getProductsByCategory);

router.get("/new-arrivals", productController.getNewArrival);

router.get("/most-popular", productController.getMostPopular);

module.exports = router;
