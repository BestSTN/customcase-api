require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoute = require("./routes/authRoute");
const error = require("./middlewares/error");
const notFound = require("./middlewares/notFound");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoute);

app.use(error);
app.use(notFound);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server is running on port: ${port}`));

// const { sequelize } = require("./models");
// sequelize.sync({ force: true });
