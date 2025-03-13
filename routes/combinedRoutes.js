const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/allData", async (req, res, next) => {
  try {
    const [data] = await db.query(`
      SELECT 
        -- Product Info
        p.id AS product_id,
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        p.image AS product_image,
        p.volume AS product_volume,
        p.abv AS product_abv,

        -- Total Quantity Sold
        COALESCE(SUM(op.quantity), 0) AS total_quantity_sold,

        -- Brand Info
        b.id AS brand_id,
        b.name AS brand_name,

        -- Category Info
        c.id AS category_id,
        c.name AS category_name,

        -- User Info (linked to order)
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,

        -- Order Info
        o.id AS order_id,
        o.order_date AS order_date,
        o.total AS order_total_price,
        o.is_paid AS order_is_paid,

        -- Details Info
        d.color AS product_color,
        d.style AS product_style

      FROM products p
      LEFT JOIN order_product op ON p.id = op.product_id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN orders o ON op.order_id = o.id
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN details d ON p.id = d.product_id 

      GROUP BY 
        p.id, p.name, p.description, p.price, p.image, p.volume, p.abv, 
        b.id, b.name, 
        c.id, c.name, 
        u.id, u.name, u.email,
        o.id, o.order_date, o.total, o.is_paid,
        d.color, d.style

      ORDER BY total_quantity_sold DESC;
    `);

    //Mappiamo i dati per unirli in un oggetto JSON unico
    const products = data.reduce((acc, row) => {
      //Cerca il prodotto nella lista già aggiunta
      let product = acc.find((p) => p.product_id === row.product_id);

      if (!product) {
        product = {
          product_id: row.product_id,
          product_name: row.product_name,
          product_description: row.product_description,
          product_price: row.product_price,
          product_image: row.product_image,
          product_volume: row.product_volume,
          product_abv: row.product_abv,
          total_quantity_sold: row.total_quantity_sold,

          brand: row.brand_id,

          brand_id: row.brand_id,
          brand_name: row.brand_name,

          category: row.category_id,

          category_id: row.category_id,
          category_name: row.category_name,

          user: row.user_id,

          user_id: row.user_id,
          user_name: row.user_name,
          user_email: row.user_email,

          color: row.product_color,
          style: row.product_style,

          order_id: row.order_id,
          order_date: row.order_date,
          order_total_price: row.order_total_price,
          order_is_paid: row.order_is_paid,

          details: [],
          orders: [],
        };

        acc.push(product);
      }

      //Aggiunge i dettagli solo se esistono e non sono duplicati
      if (
        row.product_color &&
        row.product_style &&
        !product.details.some(
          (d) => d.color === row.product_color && d.style === row.product_style
        )
      ) {
        product.details.push({
          color: row.product_color,
          style: row.product_style,
        });
      }

      //Aggiunge gli ordini solo se non sono duplicati
      if (
        row.order_id &&
        !product.orders.some((o) => o.order_id === row.order_id)
      ) {
        product.orders.push({
          order_id: row.order_id,
          order_date: row.order_date,
          order_total_price: row.order_total_price,
          order_is_paid: row.order_is_paid,
        });
      }

      return acc;
    }, []);

    // Eliminiamo gli oggetti nulli per pulizia
    products.forEach((product) => {
      if (!product.brand) delete product.brand;
      if (!product.category) delete product.category;
      if (!product.user) delete product.user;
    });

    //Se non ci sono prodotti, restituiamo un messaggio di errore
    if (products.length === 0) {
      return res.status(404).json({ message: "Nessun prodotto trovato" });
    }

    //Restituiamo tutto in un oggetto JSON ordinato
    res.json({ products });
  } catch (error) {
    next(error);
  }
});

// ✅ ROTTA PER OTTENERE I DETTAGLI DI UN SINGOLO PRODOTTO
router.get("/product/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;

    const [data] = await db.query(
      `
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
        u.email AS user_email,

        o.id AS order_id,
        o.order_date AS order_date,
        o.total AS order_total_price,
        o.is_paid AS order_is_paid,

        d.color AS product_color,
        d.style AS product_style

      FROM products p
      LEFT JOIN order_product op ON p.id = op.product_id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN orders o ON op.order_id = o.id
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN details d ON p.id = d.product_id 

      WHERE p.id = ?

      GROUP BY 
        p.id, b.id, c.id, u.id, o.id, d.color, d.style
    `,
      [productId]
    );

    if (data.length === 0) {
      return res.status(404).json({ message: "Prodotto non trovato" });
    }

    const product = {
      product_id: data[0].product_id,
      product_name: data[0].product_name,
      product_description: data[0].product_description,
      product_price: data[0].product_price,
      product_image: data[0].product_image,
      product_volume: data[0].product_volume,
      product_abv: data[0].product_abv,
      total_quantity_sold: data[0].total_quantity_sold,
      brand: data[0].brand_id,

      brand_id: data[0].brand_id,
      brand_name: data[0].brand_name,

      category: data[0].category_id,

      category_id: data[0].category_id,
      category_name: data[0].category_name,

      user: data[0].user_id,

      user_id: data[0].user_id,
      user_name: data[0].user_name,
      user_email: data[0].user_email,

      details: data.map((row) => ({
        color: row.product_color,
        style: row.product_style,
      })),
      orders: data.map((row) => ({
        order_id: row.order_id,
        order_date: row.order_date,
        order_total_price: row.order_total_price,
        order_is_paid: row.order_is_paid,
      })),
    };

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
