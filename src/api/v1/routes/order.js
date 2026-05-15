const express = require("express");
const OrderController = require("../controller/OrderController");

const router = express.Router();

router.post("/create-order", OrderController.createOrder);
router.get("/orders", OrderController.getAllOrders);
router.post("/order-by-id", OrderController.getOrderById);
router.post("/update-order-status", OrderController.updateOrderStatus);
router.post("/orders-by-user", OrderController.getOrdersByUserId);
router.post("/orders-by-vendor", OrderController.getOrdersByVendorId);
module.exports = router;
