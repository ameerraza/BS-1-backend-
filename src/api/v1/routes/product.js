const express = require("express");
const ProductController = require("../controller/ProductController");
const {
  isAuthenticated,
  restrictTo,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Route to get all categories
router.get("/categories", ProductController.getAllCategories);

// Route to create a product (restricted to vendors or admins)
router.post(
  "/create-product",
  //, // Ensures the user is logged in
  // restrictTo("Admin", "Vendor"), // Restricts access to Admins and Vendors
  ProductController.createProduct
);

// Route to get all products
router.get("/", ProductController.getAllProducts);

// Get products by Category ID (from request body)
router.post("/products-by-category", ProductController.getProductsByCategoryId);

// Route to get a single product by ID
router.get("/:id", ProductController.getProductById);
router.get("/search/:id", ProductController.searchProductsByName);

// Route to update a product by ID (restricted to vendors or admins)
router.put(
  "/:id",
  // isAuthenticated,
  // restrictTo("Admin", "Vendor"),
  ProductController.updateProduct
);

// Route to delete a product by ID (restricted to admins only)
router.delete(
  "/:id",
  // isAuthenticated,
  // restrictTo("Admin"),
  ProductController.deleteProduct
);

router.post(
  "/create-category",
  // isAuthenticated, // Ensures the user is logged in
  // restrictTo("Admin"), // Restricts access to Admins (uncomment if necessary)
  ProductController.createCategory
);


// Route to get a single category by ID
router.get("/category/:id", ProductController.getCategoryById);
router.get("/all-sub-category/:id", ProductController.getAllSubCategoryById);

// Route to update a category by ID (restricted to admins)
router.put(
  "/category/:id",
  // isAuthenticated,
  // restrictTo("Admin"),
  ProductController.updateCategory
);

// Route to delete a category by ID (restricted to admins)
router.delete(
  "/category/:id",
  // isAuthenticated,
  // restrictTo("Admin"),
  ProductController.deleteCategory
);

module.exports = router;
