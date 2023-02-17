const Cart = require("./models/cart");

module.exports.cartCount = async () => {
  let cartCount = await Cart.aggregate([
    {
      $project: {
        _id: 0,
        count: {
          $size: "$cartItems",
        },
      },
    },
  ]);
  console.log("count", cartCount[0]);
  return cartCount[0];
};
