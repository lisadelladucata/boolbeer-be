const db = require("../config/db");

let wishlist = [];

const addProductToWishlist = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [
      productId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    wishlist.push(productId);
    res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

const removeProductFromWishlist = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    wishlist.splice(index, 1);
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

const getWishlist = async (req, res) => {
  try {
    if (wishlist.length === 0) {
      return res.status(200).json([]);
    }

    const placeholders = wishlist.map(() => "?").join(", ");
    const [rows] = await db.execute(
      `SELECT * FROM products WHERE id IN (${placeholders})`,
      wishlist
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

module.exports = {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlist,
};
