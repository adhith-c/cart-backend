const express = require("express");

const cartController = require("../controllers/cartController");
const router = express.Router();
router.get("/", cartController.getCart);
router.post("/addtocart", cartController.addToCart);
router.post("/incQuantity", cartController.incrementQuantity);
router.post("/decQuantity/", cartController.decrementQuantity);
router.post("/delfromcart/", cartController.deleteFromCart);
// router.post("/checkcoupon/:userId", cartController.checkCoupon);

module.exports = router;
