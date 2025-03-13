const db = require("../config/db");

exports.getProducts = async (req, res, next) => {
  try {
    const [rows] = await db.query(` 
      SELECT products.*, COALESCE(SUM(order_product.quantity), 0) AS total_quantity_sold
      FROM products
      LEFT JOIN order_product ON products.id = order_product.product_id
      GROUP BY products.id

      
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
