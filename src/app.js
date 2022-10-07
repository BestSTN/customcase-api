require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const userRoute = require("./routes/userRoute");
const error = require("./middlewares/error");
const notFound = require("./middlewares/notFound");
const authenticate = require("./middlewares/authenticate");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("public/images", express.static("public/images"));

app.use("/auth", authRoute);
app.use("/products", productRoute);
app.use("/orders", authenticate, orderRoute);
app.use("/users", userRoute);

app.use(error);
app.use(notFound);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server is running on port: ${port}`));

// const { sequelize } = require("./models");
// sequelize.sync({ alter: true });
// sequelize.sync({ force: true });
