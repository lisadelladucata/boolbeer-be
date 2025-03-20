const express = require("express");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");
const logger = require("./middleware/logger");
const cors = require("cors");
require("dotenv").config();

const app = express();
const FE_CLIENT = process.env.FE_CLIENT;

// ✅ Middleware per parsare il JSON
app.use(express.json());

// Middleware per parsare il JSON
app.use(express.json());

// Configura CORS

app.use(
  cors({
    origin: FE_CLIENT,
  })
);

app.use(express.static("public"));
app.use(logger);

// ✅ Monta il router per Stripe Checkout
const checkoutRoutes = require("./routes/checkoutRoutes");
app.use("/checkout", checkoutRoutes);

// ✅ Monta il router per gli sconti
const discountRoutes = require("./routes/discountRoutes");
app.use("/discount", discountRoutes);

// Monta il router per le altre rotte

const combinedRoutes = require("./routes/combinedRoutes");
console.log("combinedRoutes typeof:", typeof combinedRoutes);
app.use("/", combinedRoutes);

// ✅ Monta il router per la wishlist
const wishlistRoutes = require("./routes/wishlistRoutes");
app.use("/wishlist", wishlistRoutes);

// ✅ Monta il router per il carrello
const cartRoutes = require("./routes/cartRoutes");
app.use("/cart", cartRoutes);
// ✅ Middleware per errori 404 e gestione errori

app.use(notFound);
app.use(handleErrors);

// ✅ Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server in ascolto sulla porta ${PORT}");
});
