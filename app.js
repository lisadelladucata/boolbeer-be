const express = require("express");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");
const logger = require("./middleware/logger");
const app = express();

app.use(express.json());

//middlware

app.use(logger);
app.use(notFound);
app.use(handleErrors);

const productRoutes = require("./routes/productRoutes");

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
