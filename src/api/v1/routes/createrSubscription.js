const express = require("express");
const SubscriptionController = require("../controller/SubscriptionController");
const {
  isAuthenticated,
  restrictTo,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// CRUD for subscription plans
router.post("/", isAuthenticated, SubscriptionController.createPlan); // Create a plan
router.get("/", SubscriptionController.getAllPlans); // Get all plans
router.get("/:id", SubscriptionController.getPlanById); // Get a specific plan
router.patch("/:id", isAuthenticated, SubscriptionController.updatePlan); // Update a plan
router.delete("/:id", isAuthenticated, SubscriptionController.deletePlan); // Delete a plan

// Subscription actions
router.post(
  "/subscribe",
  isAuthenticated,
  SubscriptionController.subscribeUser
); // Subscribe a user
router.post(
  "/unsubscribe",
  isAuthenticated,
  SubscriptionController.unsubscribeUser
); // Unsubscribe a user

// Route to get a user's subscription details
router.get("/user/:userId", SubscriptionController.getUserSubscription);

module.exports = router;
