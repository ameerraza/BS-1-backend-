const dotenv = require("dotenv");
const sharp = require("sharp");
const fs = require("fs/promises");
const path = require("path");
dotenv.config();

const uploadsDir = path.join(__dirname, "../../../../uploads");

const ensureUploadsDir = async () => {
  await fs.mkdir(uploadsDir, { recursive: true });
};

const stripDataUri = (value) => value.replace(/^data:.*;base64,/, "");

const getExtensionFromContentType = (contentType) => {
  switch (contentType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/heic":
    case "image/heif":
      return "heic";
    case "image/jpeg":
    case "image/jpg":
    default:
      return "jpg";
  }
};

const toBuffer = (imageInput) => {
  if (Buffer.isBuffer(imageInput)) {
    return imageInput;
  }

  if (typeof imageInput === "string") {
    return Buffer.from(stripDataUri(imageInput), "base64");
  }

  throw new Error("Unsupported image payload");
};

const s3SharpImageUpload = async (file) => {
  try {
    const buffer = toBuffer(file);

    // Get metadata to determine image format
    let metadata;
    try {
      metadata = await sharp(buffer).metadata();
      // console.log("Detected metadata:", metadata);
    } catch (err) {
      // console.warn("Unable to extract metadata, falling back to raw upload.");
      metadata = { format: "heic" }; // Fallback for HEIC/HEIF
    }

    // Handle HEIC/HEIF fallback
    if (metadata.format === "heic" || metadata.format === "heif") {
      return await uploadToS3(buffer, "image/heic");
    }

    // Process supported formats
    const processedImage = await sharp(buffer)
      .resize(300)
      .png({ quality: 40 })
      .toBuffer();

    return await uploadToS3(processedImage, "image/png");
  } catch (error) {
    throw new Error("Image upload failed");
  }
};

const uploadToS3 = async (imageInput, contentType, baseUrl = "") => {
  try {
    await ensureUploadsDir();

    const buffer = toBuffer(imageInput);
    const extension = getExtensionFromContentType(contentType);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, buffer);

    const publicPath = `/uploads/${fileName}`;
    const url = baseUrl ? `${baseUrl.replace(/\/$/, "")}${publicPath}` : publicPath;

    return { success: true, url };
  } catch (error) {
    console.error("Error uploading to server:", error);
    return { success: false, message: "Upload failed" };
  }
};

const s3SharpImageUploadArray = async (file) => {
  try {
    const buffer = toBuffer(file);
    const data = await sharp(buffer).resize(300).png({ quality: 40 }).toBuffer();
    const result = await uploadToS3(data, "image/png");
    return result.url;
  } catch (error) {
    console.log("local image upload error", error);
    throw error;
  }
};

module.exports = { s3SharpImageUpload, s3SharpImageUploadArray, uploadToS3 };
