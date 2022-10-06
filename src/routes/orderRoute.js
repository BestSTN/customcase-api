const express = require("express");

const orderController = require("../controllers/orderControllers");

const router = express.Router();

router.get("/", orderController.getAllOrder);
router.post("/", orderController.createOrder);
router.patch("/:id", orderController.updateOrderTransaction);

module.exports = router;
