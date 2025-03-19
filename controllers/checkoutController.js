// controllers/checkoutController.js
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res, next) => {
  try {
    // Ci aspettiamo che il front-end invii un array "items"
    // ad esempio: [{ name: "Prodotto A", price: 50.00, quantity: 1 }]
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Dati dell'ordine non validi" });
    }

    // Mappa gli items in line_items per Stripe (unit_amount in centesimi)
    const line_items = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      // Gli URL di successo e cancellazione puntano al tuo front-end
      success_url: `${process.env.FE_CLIENT}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FE_CLIENT}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Errore nella creazione della sessione di Checkout:", error);
    next(error);
  }
};
