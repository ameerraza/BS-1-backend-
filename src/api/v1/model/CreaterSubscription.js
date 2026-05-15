const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      enum: ["Basic", "Business", "Enterprise"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    products: {
      type: Number,
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ["Monthly", "Yearly"],
      default: "Monthly",
    },
    transactionFee: {
      type: Number, // Transaction fee percentage
      required: true,
    },
    features: [
      {
        type: String, // Features such as "Native Streaming Video" or "Native Streaming Audio"
      },
    ],
    isActive: {
      type: Boolean,
      default: true, // Indicates if this plan is available for selection
    },
    users: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model
        },
        status: {
          type: String,
          enum: ["Active", "Inactive", "Cancelled"],
          default: "Active",
        },
        startDate: {
          type: Date,
          default: Date.now,
        },
        endDate: {
          type: Date, // Subscription expiration date
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
