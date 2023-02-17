const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Product = require("../models/product");
const { cartCount } = require("../middleware");

const getCart = async (req, res) => {
  try {
    // let prod = await Product.find({});
    let cart = await Cart.findOne({}).populate({
      path: "cartItems",
      populate: {
        path: "productId",
      },
    });
    if (cart) {
      const counter = await cartCount();
      console.log("counter", counter);
      res.status(200).json({ cart, counter });
    } else {
      res.status(400).json({ msg: "cart empty" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

const addToCart = async (req, res) => {
  try {
    let productId = req.body.productId;
    console.log("productId", productId);

    productId = new mongoose.Types.ObjectId(productId);
    const existCart = await Cart.findOne({});
    if (existCart) {
      let productExist = await Cart.findOne({
        cartItems: {
          $elemMatch: {
            productId,
          },
        },
      });
      if (productExist) {
        await Cart.findOneAndUpdate(
          {
            "cartItems.productId": productId,
          },

          {
            $inc: {
              "cartItems.$.productQuantity": 1,
            },
          }
        );
        const counter = await cartCount();
        res.status(200).json({ msg: "product count incremented", counter });
      } else {
        await Cart.updateOne(
          {},
          {
            $push: {
              cartItems: {
                productId,
                productQuantity: 1,
              },
            },
          }
        );
        res.status(200).json({ msg: "product added to cart successfully" });
      }
    } else {
      try {
        let cart = new Cart({
          cartItems: [
            {
              productId,
              productQuantity: 1,
            },
          ],
        });
        await cart.save();
        res.status(200).json({ msg: "cart added successfully" });
      } catch (err) {
        const msg = "cart adding failed";
        res.status(500).json({ msg });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

const incrementQuantity = async (req, res) => {
  try {
    let productId = req.body.productId;
    productId = new mongoose.Types.ObjectId(productId);

    await Cart.findOneAndUpdate(
      {
        "cartItems.productId": productId,
      },

      {
        $inc: {
          "cartItems.$.productQuantity": 1,
        },
      }
    );
    const counter = await cartCount();
    res.status(200).json({ msg: "incremented quantity sucess", counter });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

const decrementQuantity = async (req, res) => {
  try {
    let productId = req.body.productId;
    console.log("decrement prodid is", productId);
    productId = mongoose.Types.ObjectId(productId);
    console.log("decrement prodid is", productId);

    await Cart.findOneAndUpdate(
      {
        "cartItems.productId": productId,
      },
      {
        $inc: {
          "cartItems.$.productQuantity": -1,
        },
      }
    );
    const counter = await cartCount();
    res.status(200).json({ msg: "decrement product quantity", counter });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const productId = req.body.productId;
    console.log("productid", productId);

    await Cart.updateOne(
      {},
      {
        $pull: {
          cartItems: {
            productId: productId,
          },
        },
      }
    );
    const counter = await cartCount();
    res.status(200).json({
      msg: "deleted item from cart",
      counter,
    });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

module.exports = {
  getCart,
  addToCart,
  incrementQuantity,
  decrementQuantity,
  deleteFromCart,
};
