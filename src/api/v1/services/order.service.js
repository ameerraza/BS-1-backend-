const Order = require("../model/Order");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../model/Users");
const Product = require("../model/ProductModal");
const Category = require("../model/CategoryModal");
const AppError = require("../utils/AppError");
const HttpStatusCodes = require("../enums/httpStatusCode");
const { createJwtToken } = require("../middlewares/auth.middleware");
const { s3SharpImageUpload } = require("../services/aws.service");
const { sendEmail, sendOrderDetailsEmail } = require("../utils/email");
class OrderService {
  /**
   * Create a new order
   * @param {Object} data - Order details
   */
  static async createOrder(data) {
    const {
      userId,
      vendorId,
      productId,
      type,
      fullName,
      email,
      phoneNumber,
      cnicNumber,
      cnicFrontImage,
      cnicBackImage,
      address,
      city,
      transactionId,
      receiptImage,
      startDate,
      endDate,
      productPrice,
      deliveryCharges,
      totalAmount,
    } = data;

    // Validate required fields
    if (
      !userId ||
      !vendorId ||
      !productId ||
      !type ||
      !fullName ||
      !email ||
      !phoneNumber ||
      !cnicNumber ||
      // !cnicFrontImage ||
      // !cnicBackImage ||
      // !address ||
      // !city ||
      // !transactionId ||
      // !receiptImage ||
      // !productPrice ||
      // !deliveryCharges ||
      !totalAmount
    ) {
      throw new AppError(
        "All fields are required.",
        HttpStatusCodes.BAD_REQUEST
      );
    }

    // Create a new order
    const newOrder = new Order({
      userId,
      vendorId,
      productId,
      type,
      fullName,
      email,
      phoneNumber,
      cnicNumber,
      cnicFrontImage,
      cnicBackImage,
      address,
      city,
      transactionId,
      receiptImage,
      startDate,
      endDate,
      productPrice,
      deliveryCharges,
      totalAmount,
      status: "Pending",
    });

    // Save order to database
    const savedOrder = await newOrder.save();
    // Get the vendor's email (assuming vendorId is associated with the vendor's email)
    const vendor = await User.findById(vendorId); // Assuming Vendor is a model where vendor information is stored
    const vendorEmail = vendor?.email;

    // Send email to the vendor with the order details
    await sendOrderDetailsEmail(vendorEmail, [savedOrder]); // Sending the saved order as an array

    return {
      message: "Order placed successfully.",
      success: true,
      order: savedOrder,
    };
  }

  /**
   * Get all orders
   */
  static async getAllOrders() {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("vendorId", "name email")
      .populate("productId", "name price");
    return {
      success: true,
      orders,
    };
  }

  /**
   * Get order by ID
   * @param {String} orderId - Order ID
   */
  static async getOrderById(orderId) {
    const order = await Order.findById(orderId)
      .populate("userId", "name email")
      .populate("vendorId", "name email")
      .populate("productId", "name price");

    if (!order) {
      throw new AppError("Order not found.", HttpStatusCodes.NOT_FOUND);
    }

    return {
      success: true,
      order,
    };
  }

  /**
   * Update order status
   * @param {String} orderId - Order ID
   * @param {String} status - New status
   */
  static async updateOrderStatus(orderId, status) {
    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Completed",
      "Cancelled",
      "Confirmed",
    ];

    if (!validStatuses.includes(status)) {
      throw new AppError("Invalid order status.", HttpStatusCodes.BAD_REQUEST);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError("Order not found.", HttpStatusCodes.NOT_FOUND);
    }

    order.status = status;
    await order.save();

    return {
      message: `Order status updated to ${status}.`,
      success: true,
      order,
    };
  }

  static async getOrdersByUserId(data) {
    const { userId } = data;

    if (!userId) {
      throw new AppError("User ID is required.", HttpStatusCodes.BAD_REQUEST);
    }
    console.log("userIduserId", userId);
    const orders = await Order.find({ userId: userId })
      .populate("userId", "name email")
      .populate("vendorId", "name email")
      .populate("productId", "name price");

    if (!orders.length) {
      throw new AppError(
        "No orders found for this user.",
        HttpStatusCodes.NOT_FOUND
      );
    }

    return {
      success: true,
      orders,
    };
  }

  static async getOrdersByVendorId(data) {
    const { vendorId } = data;

    if (!vendorId) {
      throw new AppError("Vendor ID is required.", HttpStatusCodes.BAD_REQUEST);
    }

    const orders = await Order.find({ vendorId })
      .populate("userId", "name email")
      .populate("vendorId", "name email")
      .populate("productId", "name price");

    if (!orders.length) {
      throw new AppError(
        "No orders found for this vendor.",
        HttpStatusCodes.NOT_FOUND
      );
    }

    return {
      success: true,
      orders,
    };
  }
}

module.exports = OrderService;
