
const db = require("../config/db");

// Crea un nuovo carrello anonimo e restituisce il suo ID
const createCart = async (req, res) => {
  try {
    const [newCart] = await db.execute(
      'INSERT INTO orders (user_id, order_date, total, is_paid, status) VALUES (NULL, NOW(), 0, false, "cart")'
    );
    return res.json({ cartId: newCart.insertId });
  } catch (error) {
    console.error("Errore durante la creazione del carrello:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

// Aggiunge o aggiorna un prodotto nel carrello (basato su cartId) e restituisce il carrello aggiornato
const addToCart = async (req, res) => {
  const { cartId, productId, quantity } = req.body;
  if (!cartId || !productId || quantity == null) {
    return res.status(400).json({ error: "Dati mancanti" });
  }

  try {
    console.log("👉 Dati ricevuti dal frontend:", req.body);

    // Verifica che il prodotto esista nella tabella products
    const [product] = await db.execute(
      "SELECT name, price, image FROM products WHERE id = ?",
      [productId]
    );
    if (product.length === 0) {
      console.error("❌ Prodotto non trovato");
      return res.status(404).json({ error: "Prodotto non trovato" });
    }

    // Controlla se esiste già una riga in order_product
    const [existingRow] = await db.execute(
      "SELECT quantity FROM order_product WHERE order_id = ? AND product_id = ?",
      [cartId, productId]
    );

    if (existingRow.length > 0) {
      // La riga esiste, aggiorniamo la quantità
      const currentQty = existingRow[0].quantity;
      const newQty = currentQty + quantity; // quantity può essere negativo (es. -1)

      if (newQty <= 0) {
        // Se la nuova quantità è <= 0, rimuoviamo la riga
        await db.execute(
          "DELETE FROM order_product WHERE order_id = ? AND product_id = ?",
          [cartId, productId]
        );
      } else {
        // Altrimenti aggiorniamo la quantità
        await db.execute(
          "UPDATE order_product SET quantity = ? WHERE order_id = ? AND product_id = ?",
          [newQty, cartId, productId]
        );
      }
    } else {
      // Non esiste la riga
      // Se quantity è positivo, inseriamo una nuova riga
      if (quantity > 0) {
        await db.execute(
          `INSERT INTO order_product (order_id, product_id, name, price, quantity, image)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            cartId,
            productId,
            product[0].name,
            product[0].price,
            quantity,
            product[0].image,
          ]
        );
      }
      // Se quantity è negativo o zero e la riga non esiste, non facciamo nulla
    }

    // Infine, recuperiamo il carrello aggiornato
    const [items] = await db.execute(
      `SELECT op.product_id, op.name, op.price, op.quantity, op.image
         FROM order_product op
        WHERE op.order_id = ?`,
      [cartId]
    );

    console.log("✅ Carrello aggiornato dal backend:", items);
    return res.status(201).json({ items });
  } catch (error) {
    console.error("❌ Errore durante l'aggiunta al carrello:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

// Recupera il contenuto di un carrello in base al cartId
const getCart = async (req, res) => {
  const { cartId } = req.params;
  console.log("👉 Richiesta per carrello con ID:", cartId);
  try {
    const [items] = await db.execute(
      `SELECT op.product_id, op.name, op.price, op.quantity, op.image
         FROM order_product op
         INNER JOIN products p ON op.product_id = p.id
        WHERE op.order_id = ?`,
      [cartId]
    );
    console.log("✅ Carrello recuperato:", items);
    return res.status(200).json({ items });
  } catch (error) {
    console.error("❌ Errore durante il recupero del carrello:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

// Rimuove un prodotto dal carrello e restituisce il carrello aggiornato
const removeFromCart = async (req, res) => {
  const { cartId, productId } = req.body;
  try {
    console.log("👉 Tentativo di rimozione prodotto:", productId);
    await db.execute(
      "DELETE FROM order_product WHERE order_id = ? AND product_id = ?",
      [cartId, productId]
    );
    const [items] = await db.execute(
      `SELECT op.product_id, op.name, op.price, op.quantity, op.image
         FROM order_product op
         INNER JOIN products p ON op.product_id = p.id
        WHERE op.order_id = ?`,
      [cartId]
    );
    console.log("✅ Carrello aggiornato dopo la rimozione:", items);
    return res.status(200).json({ items });
  } catch (error) {
    console.error("❌ Errore durante la rimozione dal carrello:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

// Completa l'ordine
const completeOrder = async (req, res) => {
  const { cartId } = req.body;
  try {
    await db.execute(
      'UPDATE orders SET status = "ordered", is_paid = true WHERE id = ?',
      [cartId]
    );
    return res.status(200).json({ message: "Ordine completato!" });
  } catch (error) {
    console.error("❌ Errore durante la finalizzazione dell'ordine:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

module.exports = {
  createCart,
  addToCart,
  getCart,
  removeFromCart,
  completeOrder,

exports.addToCart = (req, res) => {
  const { id, name, price, quantity } = req.body;

  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex >= 0) {
    cart[itemIndex].quantity += quantity;
  } else {
    cart.push({ id, name, price, quantity });
  }

  res.json({ cart });
};

exports.removeFromCart = (req, res) => {
  const { id } = req.params;

  cart = cart.filter((item) => item.id !== id);

  res.json({ success: true, cart });
};

exports.getCart = (req, res) => {
  res.json({ cart });

};
