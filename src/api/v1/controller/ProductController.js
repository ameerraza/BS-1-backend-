const ProductService = require("../services/product.service");
const catchAsyncHandler = require("../utils/catchAsyncHandler");

class ProductController {
  static createProduct = catchAsyncHandler(async (req, res) => {
    const result = await ProductService.createProduct(req.body);
    return res.status(201).json(result);
  });

  /**
   * Get all products
   */
  static getAllProducts = catchAsyncHandler(async (req, res) => {
    const result = await ProductService.getAllProducts();
    return res.status(200).json(result);
  });

  /**
   * Search products by name (partial match)
   */
  static searchProductsByName = catchAsyncHandler(async (req, res) => {
    const name  = req.params.id; // Get search term from query parameters

    if (!name) {
      throw new AppError(
        "Search query is required.",
        HttpStatusCodes.BAD_REQUEST
      );
    }

    const result = await ProductService.searchProductsByName(name);
    return res.status(200).json(result);
  });

  /**
   * Get product by ID
   */
  static getProductById = catchAsyncHandler(async (req, res) => {
    const result = await ProductService.getProductById(req.params.id);
    return res.status(200).json(result);
  });

  /**
   * Update product by ID
   */
  static updateProduct = catchAsyncHandler(async (req, res) => {
    const result = await ProductService.updateProduct(req.params.id, req.body);
    return res.status(200).json(result);
  });

  /**
   * Get Products by Category ID from request body
   */
  static getProductsByCategoryId = catchAsyncHandler(async (req, res) => {
    const result = await ProductService.getProductsByCategoryId(req.body);
    return res.status(200).json(result);
  });

  /**
   * Delete product by ID
   */
  static deleteProduct = catchAsyncHandler(async (req, res) => {
    const result = await ProductService.deleteProduct(req.params.id);
    return res.status(200).json(result);
  });

  static createCategory = catchAsyncHandler(async (req, res) => {
    const result = await ProductService.createCategory(req.body);
    return res.status(201).json(result);
  });

  /**
   * Get all categories
   */
  static getAllCategories = catchAsyncHandler(async (req, res) => {
    console.log("Get all categories");
    const result = await ProductService.getAllCategories();
    return res.status(200).json(result);
  });

  /**
   * Get category by ID
   */
  static getCategoryById = catchAsyncHandler(async (req, res) => {
    const result = await ProductService.getCategoryById(req.params.id);
    return res.status(200).json(result);
  });

  static getAllSubCategoryById = catchAsyncHandler(async (req, res) => {
    const result = await ProductService.getAllSubCategoryById(req.params.id);
    return res.status(200).json(result);
  });

  /**
   * Update category by ID
   */
  static updateCategory = catchAsyncHandler(async (req, res) => {
    const result = await ProductService.updateCategory(req.params.id, req.body);
    return res.status(200).json(result);
  });

  /**
   * Delete category by ID
   */
  static deleteCategory = catchAsyncHandler(async (req, res) => {
    const result = await ProductService.deleteCategory(req.params.id);
    return res.status(200).json(result);
  });
}

module.exports = ProductController;
