const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Subscription = require("../model/CreaterSubscription");
const AppError = require("../utils/AppError");
const HttpStatusCodes = require("../enums/httpStatusCode");
const { createJwtToken } = require("../middlewares/auth.middleware");
const { s3SharpImageUpload } = require("../services/aws.service");
const mongoose = require("mongoose");
class SubscriptionService {
  // Create a new subscription plan
  static async createPlan(data) {
    const { planName, price, billingCycle, transactionFee, features,products } = data;

    if (
      !planName ||
      !price ||
      !transactionFee ||
      !features ||
      features.length === 0
    ) {
      throw new AppError("All fields are required.", 400);
    }

    const plan = await Subscription.create({
      planName,
      price,
      billingCycle,
      transactionFee,
      features,
    });

    return plan;
  }

  // Get all subscription plans
  static async getAllPlans() {
    return await Subscription.find();
  }

  // Get a specific subscription plan
  static async getPlanById(planId) {
    const plan = await Subscription.findById(planId);
    if (!plan) {
      throw new AppError("Subscription plan not found.", 404);
    }
    return plan;
  }

  // Update a subscription plan
  static async updatePlan(planId, data) {
    const plan = await Subscription.findByIdAndUpdate(planId, data, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      throw new AppError("Subscription plan not found.", 404);
    }

    return plan;
  }

  // Delete a subscription plan
  static async deletePlan(planId) {
    const plan = await Subscription.findByIdAndDelete(planId);
    if (!plan) {
      throw new AppError("Subscription plan not found.", 404);
    }

    return { message: "Subscription plan deleted successfully." };
  }

  // Subscribe a user to a plan
  static async subscribeUser(data) {
    const { userId, planId } = data;

    const plan = await Subscription.findById(planId);
    if (!plan) {
      throw new AppError("Subscription plan not found.", 404);
    }

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const subscription = {
      userId,
      status: "Active",
      startDate: new Date(),
      endDate,
    };

    plan.users.push(subscription);
    await plan.save();

    return subscription;
  }

  // Unsubscribe a user from a plan
  static async unsubscribeUser(data) {
    const { userId, planId } = data;

    const plan = await Subscription.findById(planId);
    if (!plan) {
      throw new AppError("Subscription plan not found.", 404);
    }

    const userSubscription = plan.users.find(
      (user) => user.userId.toString() === userId && user.status === "Active"
    );

    if (!userSubscription) {
      throw new AppError("Active subscription not found for this user.", 404);
    }

    userSubscription.status = "Cancelled";
    await plan.save();

    return { message: "User unsubscribed successfully." };
  }

  static async getUserSubscription(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID.", 400);
    }

    // Find the subscription that includes the userId in its users array
    const subscription = await Subscription.findOne({
      "users.userId": userId,
    }).populate({
      path: "users.userId",
      select: "name email", // Select the fields you want from the User model
    });

    if (!subscription) {
      throw new AppError("Subscription not found for this user.", 404);
    }

    // Find the specific user's subscription details within the users array
    const userSubscription = subscription.users.find(
      (user) => user.userId._id.toString() === userId
    );

    if (!userSubscription) {
      throw new AppError("User subscription details not found.", 404);
    }

    return {
      planName: subscription.planName,
      price: subscription.price,
      billingCycle: subscription.billingCycle,
      transactionFee: subscription.transactionFee,
      features: subscription.features,
      isActive: subscription.isActive,
      userSubscription: {
        status: userSubscription.status,
        startDate: userSubscription.startDate,
        endDate: userSubscription.endDate,
        user: userSubscription.userId, // This contains the populated user details
      },
    };
  }
}

module.exports = SubscriptionService;
