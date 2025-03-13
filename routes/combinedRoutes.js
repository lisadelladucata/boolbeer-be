const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Endpoint per ottenere tutti i brand
router.get("/brands", async (req, res, next) => {
  try {
    const [brands] = await db.query("SELECT * FROM brands");
    res.json(brands);
  } catch (error) {
    next(error);
  }
});
// Endpoint per ottenere tutti i prodotti
router.get("/products", async (req, res, next) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    res.json(products);
  } catch (error) {
    next(error);
  }
});
//Endpoint per ottenere prodotti e brand
router.get("/allData", async (req, res, next) => {
  try {
    const [brands] = await db.query("SELECT * FROM brands");
    const [products] = await db.query("SELECT * FROM products");
    res.json({ brands, products });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
