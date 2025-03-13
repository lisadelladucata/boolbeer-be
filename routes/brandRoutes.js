const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");

router.get("/", brandController.getBrands);

router.get("/:id", brandController.getBrandById);

module.exports = router;
