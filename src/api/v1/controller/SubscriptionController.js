const SubscriptionService = require("../services/creater.subscription");
const catchAsyncHandler = require("../utils/catchAsyncHandler");

class SubscriptionController {
  // Create a new subscription plan
  static createPlan = catchAsyncHandler(async (req, res) => {
    const plan = await SubscriptionService.createPlan(req.body);
    res.status(201).json({
      message: "Subscription plan created successfully.",
      success: true,
      data: plan,
    });
  });

  // Get all subscription plans
  static getAllPlans = catchAsyncHandler(async (req, res) => {
    const plans = await SubscriptionService.getAllPlans();
    res.status(200).json({
      message: "Subscription plans retrieved successfully.",
      success: true,
      data: plans,
    });
  });

  // Get a specific subscription plan
  static getPlanById = catchAsyncHandler(async (req, res) => {
    const plan = await SubscriptionService.getPlanById(req.params.id);
    res.status(200).json({
      message: "Subscription plan retrieved successfully.",
      success: true,
      data: plan,
    });
  });

  // Update a subscription plan
  static updatePlan = catchAsyncHandler(async (req, res) => {
    const plan = await SubscriptionService.updatePlan(req.params.id, req.body);
    res.status(200).json({
      message: "Subscription plan updated successfully.",
      success: true,
      data: plan,
    });
  });

  // Delete a subscription plan
  static deletePlan = catchAsyncHandler(async (req, res) => {
    const result = await SubscriptionService.deletePlan(req.params.id);
    res.status(200).json(result);
  });

  // Subscribe a user to a plan
  static subscribeUser = catchAsyncHandler(async (req, res) => {
    const subscription = await SubscriptionService.subscribeUser(req.body);
    res.status(201).json({
      message: "User subscribed successfully.",
      success: true,
      data: subscription,
    });
  });

  // Unsubscribe a user from a plan
  static unsubscribeUser = catchAsyncHandler(async (req, res) => {
    const result = await SubscriptionService.unsubscribeUser(req.body);
    res.status(200).json(result);
  });

  static getUserSubscription = catchAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const subscription = await SubscriptionService.getUserSubscription(userId);
    res.status(200).json({
      message: "User subscription retrieved successfully.",
      success: true,
      data: subscription,
    });
  });
}

module.exports = SubscriptionController;
