require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const app = express();
const path = require("path");

const cookieParser = require("cookie-parser");

const dbConfig = require("./config/dbConfig");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cartRoutes = require("./routes/cartRoutes");

app.use(cookieParser());

app.use("/cart", cartRoutes);

dbConfig();
app.listen(process.env.PORT, () => {
  console.log(`Listening to the server on ${process.env.PORT} !!!`);
});
