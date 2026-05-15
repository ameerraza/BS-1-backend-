const OrderService = require("../services/order.service");
const catchAsyncHandler = require("../utils/catchAsyncHandler");

class OrderController {
  static createOrder = catchAsyncHandler(async (req, res) => {
    const result = await OrderService.createOrder(req.body);
    return res.status(201).json(result);
  });

  static getAllOrders = catchAsyncHandler(async (req, res) => {
    const result = await OrderService.getAllOrders();
    return res.status(200).json(result);
  });

  static getOrderById = catchAsyncHandler(async (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
      throw new AppError("Order ID is required.", HttpStatusCodes.BAD_REQUEST);
    }
    const result = await OrderService.getOrderById(orderId);
    return res.status(200).json(result);
  });

  static updateOrderStatus = catchAsyncHandler(async (req, res) => {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      throw new AppError(
        "Order ID and status are required.",
        HttpStatusCodes.BAD_REQUEST
      );
    }
    const result = await OrderService.updateOrderStatus(orderId, status);
    return res.status(200).json(result);
  });

  static getOrdersByUserId = catchAsyncHandler(async (req, res) => {
    const result = await OrderService.getOrdersByUserId(req.body);
    return res.status(200).json(result);
  });

  static getOrdersByVendorId = catchAsyncHandler(async (req, res) => {
    const result = await OrderService.getOrdersByVendorId(req.body);
    return res.status(200).json(result);
  });
  

  
}

module.exports = OrderController;
