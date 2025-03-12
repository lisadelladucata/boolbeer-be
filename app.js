const express = require("express");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");
const logger = require("./middleware/logger");
const app = express();

app.use(express.json());
app.use(logger);

const productRoutes = require("./routes/productRoutes");
app.use("/products", productRoutes);

app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
