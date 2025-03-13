// controllers/brandController.js
const db = require("../config/db");

exports.getBrands = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM brands");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getBrandById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM brands WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Brand non trovato" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};
