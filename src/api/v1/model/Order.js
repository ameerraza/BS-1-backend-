const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: ["rent", "buy"],
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      //required: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address.",
      ],
    },
    phoneNumber: {
      type: String,
      //required: true,
      match: [/^\d{10,15}$/, "Please provide a valid phone number."],
    },
    cnicNumber: {
      type: String,
      //required: true,
      match: [/^\d{13}$/, "Please provide a valid 13-digit CNIC number."],
    },
    cnicFrontImage: {
      type: String, // URL for the uploaded CNIC front image
      //required: true,
    },
    cnicBackImage: {
      type: String, // URL for the uploaded CNIC back image
      //required: true,
    },
    address: {
      type: String,
      //required: true,
      trim: true,
    },
    city: {
      type: String,
      //required: true,
      trim: true,
    },
    transactionId: {
      type: String,
      //required: true,
      trim: true,
    },
    receiptImage: {
      type: String, // URL for the uploaded payment receipt
      //required: true,
    },
    startDate: {
      type: Date, // For rentals
    },
    endDate: {
      type: Date, // For rentals
    },
    productPrice: {
      type: Number,
      //required: true,
    },
    deliveryCharges: {
      type: Number,
      //required: true,
    },
    totalAmount: {
      type: Number,
      //required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Completed",
        "Cancelled",
        "Confirmed",
      ],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
