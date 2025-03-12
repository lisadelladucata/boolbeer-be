const db = require("../config/db");

exports.getProducts = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  const { category_id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE category_id = ?",
      [category_id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
