const mongoose = require("mongoose");

const vendorRequestSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Please provide the company name."],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    ownerFullName: {
      type: String,
      required: [true, "Please provide the owner's full name."],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    businessEmail: {
      type: String,
      required: [true, "Please provide the business email."],
      trim: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address.",
      ],
    },
    contactNumber: {
      type: String,
      required: [true, "Please provide a contact number."],
      // match: [/^\d{10,15}$/, "Please provide a valid contact number."],
    },
    businessAddress: {
      type: String,
      required: [true, "Please provide the business address."],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Please provide the city."],
      trim: true,
    },
    businessType: {
      type: String,
      required: [true, "Please provide the business type."],
      // enum: ["Retail", "Manufacturing", "Services", "Others"],
    },
    typesOfProducts: {
      type: String,
      required: [true, "Please provide the types of products."],
      trim: true,
    },
    taxRegistrationNumber: {
      type: String,
      required: [true, "Please provide the tax registration number."],
      unique: true,
      trim: true,
    },
    businessLicense: {
      type: String, // URL to the uploaded file
      required: [true, "Please upload the business license."],
    },

    // **New Fields for Better Synchronization**
    cnicNumber: {
      type: String,
      required: [true, "Please provide the CNIC number."],
      unique: true,
      trim: true,
    },
    cnicFrontImage: {
      type: String, // URL for CNIC front image
      required: [true, "Please upload the CNIC front image."],
    },
    cnicBackImage: {
      type: String, // URL for CNIC back image
      required: [true, "Please upload the CNIC back image."],
    },

    idCardImage: {
      type: String, // This can be removed in favor of cnicFrontImage & cnicBackImage
      required: false, // No longer required, as we now store CNIC separately
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
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

const VendorRequest = mongoose.model("VendorRequest", vendorRequestSchema);

module.exports = VendorRequest;
