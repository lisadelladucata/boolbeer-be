const db = require("../config/db");

exports.getProducts = async (req, res, next) => {
  try {
    const [rows] = await db.query(` 
      SELECT products.*, COALESCE(SUM(order_product.quantity), 0) AS total_quantity_sold
      FROM products
      LEFT JOIN order_product ON products.id = order_product.product_id
      GROUP BY products.id
      ORDER BY total_quantity_sold DESC;
`);
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

exports.getNewArrival = async (req, res, next) => {
  try {
    const [results] = await db.query(
      ` SELECT *
    FROM products
    ORDER BY id DESC
    LIMIT 10;
  `
    );
    res.json(results);
  } catch (err) {
    next(err);
  }
};

exports.getMostPopular = async (req, res, next) => {
  try {
    const [results] = await db.query(
      ` SELECT *
FROM order_product
ORDER BY quantity DESC;
  `
    );
    res.json(results);
  } catch (err) {
    next(err);
  }
};
