const express = require("express");
const app = express();

app.use(express.json());

const logger = require("./middleware/logger");
app.use(logger);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Errore interno al server" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
