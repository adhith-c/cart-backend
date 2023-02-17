require("dotenv").config;
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const dbConfig = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://adhithc:adhithc10@cluster0.qovfckv.mongodb.net/cart?retryWrites=true&w=majority"
      )
      .then(() => {
        console.log("database connected !!!");
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = dbConfig;
