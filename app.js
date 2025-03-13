const express = require("express");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");
const logger = require("./middleware/logger");
const cors = require("cors");
require("dotenv").config();

const app = express();
const FE_CLIENT = process.env.FE_CLIENT;

app.use(
  cors({
    origin: FE_CLIENT,
  })
);
app.use(express.static("public"));

app.use(express.json());
app.use(logger);

const combinedRoutes = require("./routes/combinedRoutes");
app.use("/", combinedRoutes);

app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
