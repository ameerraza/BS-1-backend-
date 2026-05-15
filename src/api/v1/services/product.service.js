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
const { sendEmail } = require("../utils/email");

// const sendEmail = require("../utils/sendEmail"); // Utility for sending emails

class ProductService {
  static async createProduct(data) {
    const {
      name,
      description,
      location,
      condition,
      category,
      vendorId,
      price,
      rentPrice,
      images,
    } = data;

    const normalizedCategory =
      typeof category === "string" && !category.trim() ? undefined : category;
    const normalizedVendorId =
      typeof vendorId === "string" && !vendorId.trim() ? undefined : vendorId;

    if (!normalizedCategory) {
      throw new AppError(
        "Please provide the product category.",
        HttpStatusCodes.BAD_REQUEST
      );
    }

    if (!normalizedVendorId) {
      throw new AppError(
        "Please provide the vendor ID.",
        HttpStatusCodes.BAD_REQUEST
      );
    }

    // Check if the product already exists with the same name for the vendor
    const existingProduct = await Product.findOne({ name, vendorId: normalizedVendorId });
    if (existingProduct) {
      throw new AppError(
        "Product with the same name already exists.",
        HttpStatusCodes.BAD_REQUEST
      );
    }

    const categoryExists = await Category.findById(normalizedCategory);
    if (!categoryExists) {
      throw new AppError(
        "Invalid category ID provided.",
        HttpStatusCodes.BAD_REQUEST
      );
    }

    // Create the new product
    const newProduct = new Product({
      name,
      description,
      category: normalizedCategory,
      location,
      condition,
      vendorId: normalizedVendorId,
      price,
      rentPrice,
      images, // Accepts an array of image URLs
      status: "Available", // Default status
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    return {
      message: "Product created successfully.",
      success: true,
      product: savedProduct,
    };
  }

  /**
   * Get all products
   */
  static async getAllProducts() {
    const products = await Product.find()
      .populate("category")
      .populate("vendorId");
    return {
      success: true,
      products,
    };
  }

  /**
   * Search products by name (partial match)
   */
  static async searchProductsByName(searchQuery) {
    if (!searchQuery) {
      throw new AppError(
        "Search query is required.",
        HttpStatusCodes.BAD_REQUEST
      );
    }

    const products = await Product.find({
      name: { $regex: searchQuery, $options: "i" }, // Case-insensitive partial match
    })
      .populate("category")
      .populate("vendorId");

    return {
      success: true,
      products,
    };
  }

  static async getProductsByCategoryId(data) {
    const { categoryId } = data;

    if (!categoryId) {
      throw new AppError(
        "Category ID is required.",
        HttpStatusCodes.BAD_REQUEST
      );
    }

    const products = await Product.find({ category: categoryId }) // Filter by category
      .populate({
        path: "category",
        select: "name _id",
      })
      .populate({
        path: "vendorId",
        select: "name email",
      });

    if (!products.length) {
      throw new AppError(
        "No products found for this category.",
        HttpStatusCodes.NOT_FOUND
      );
    }

    return {
      success: true,
      products,
    };
  }

  /**
   * Get a single product by ID
   */
  static async getProductById(productId) {
    const product = await Product.findById(productId)
      .populate("category")
      .populate("vendorId");
    if (!product) {
      throw new AppError("Product not found.", HttpStatusCodes.NOT_FOUND);
    }

    return {
      success: true,
      product,
    };
  }

  /**
   * Update a product by ID
   */
  static async updateProduct(productId, data) {
    const updatedProduct = await Product.findByIdAndUpdate(productId, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      throw new AppError("Product not found.", HttpStatusCodes.NOT_FOUND);
    }

    return {
      message: "Product updated successfully.",
      success: true,
      product: updatedProduct,
    };
  }

  /**
   * Delete a product by ID
   */
  static async deleteProduct(productId) {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      throw new AppError("Product not found.", HttpStatusCodes.NOT_FOUND);
    }

    return {
      message: "Product deleted successfully.",
      success: true,
    };
  }

  static async createCategory(data) {
    const { name, description, parentCategory } = data;

    // Check if the category already exists with the same name
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new AppError(
        "Category with the same name already exists.",
        HttpStatusCodes.BAD_REQUEST
      );
    }

    // If a parent category is provided, validate its existence
    if (parentCategory) {
      const parentCategoryExists = await Category.findById(parentCategory);
      if (!parentCategoryExists) {
        throw new AppError(
          "Invalid parent category ID provided.",
          HttpStatusCodes.BAD_REQUEST
        );
      }
    }

    // Create the new category
    const newCategory = new Category({
      name,
      description,
      parentCategory: parentCategory || null, // Assign null if no parent category is provided
      status: "Active", // Default status
    });

    // Save the category to the database
    const savedCategory = await newCategory.save();

    return {
      message: "Category created successfully.",
      success: true,
      category: savedCategory,
    };
  }

  /**
   * Get all categories
   */
  static async getAllCategories() {
    console.log("Get all categories");
    const categories = await Category.find().populate("parentCategory");
    return {
      message: "Category created successfully.",
      success: true,
      categories,
    };
  }

  /**
   * Get a single category by ID
   */
  static async getCategoryById(categoryId) {
    const category = await Category.findById(categoryId).populate(
      "parentCategory"
    );
    if (!category) {
      throw new AppError("Category not found.", HttpStatusCodes.NOT_FOUND);
    }

    return {
      success: true,
      category,
    };
  }

  /**
   * Get a single category by ID
   */
  static async getAllSubCategoryById(parentCategory) {
    const category = await Category.find({ parentCategory });

    if (!category || category.length === 0) {
      // Check if the array is empty
      throw new AppError("Category not found.", HttpStatusCodes.NOT_FOUND);
    }

    return {
      success: true,
      category,
    };
  }

  /**
   * Update a category by ID
   */
  static async updateCategory(categoryId, data) {
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      throw new AppError("Category not found.", HttpStatusCodes.NOT_FOUND);
    }

    return {
      message: "Category updated successfully.",
      success: true,
      category: updatedCategory,
    };
  }

  /**
   * Delete a category by ID
   */
  static async deleteCategory(categoryId) {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      throw new AppError("Category not found.", HttpStatusCodes.NOT_FOUND);
    }

    return {
      message: "Category deleted successfully.",
      success: true,
    };
  }
}

module.exports = ProductService;
