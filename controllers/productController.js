const db = require("../config/db");

exports.getAllData = async (req, res, next) => {
  try {
    const [data] = await db.query(`
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        p.image AS product_image,
        p.volume AS product_volume,
        p.abv AS product_abv,
        COALESCE(SUM(op.quantity), 0) AS total_quantity_sold,
        b.id AS brand_id,
        b.name AS brand_name,
        c.id AS category_id,
        c.name AS category_name,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email
      FROM products p
      LEFT JOIN order_product op ON p.id = op.product_id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN orders o ON op.order_id = o.id
      LEFT JOIN users u ON o.user_id = u.id
      GROUP BY p.id, b.id, c.id, u.id
      ORDER BY total_quantity_sold DESC;
    `);

    res.json(data);
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
