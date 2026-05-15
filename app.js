const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const globalErrorHandler = require("./src/api/v1/middlewares/globalErrorHandler");
if (process.env.NODE_ENV === "PRODUCTION") {
  require("dotenv").config({ path: "./.env.production" });
} else {
  require("dotenv").config();
}

const usersRoutes = require("./src/api/v1/routes/user");
const productRoute = require("./src/api/v1/routes/product");
const orderRoute = require("./src/api/v1/routes/order");
const createrSubscriptionRoutes = require("./src/api/v1/routes/createrSubscription");
const chatRoute = require("./src/api/v1/routes/chat");
// const scheduleRoute = require("./src/api/v1/routes/Schedule");
// const employeeRoute = require("./src/api/v1/routes/employee");
// const projectRoute = require("./src/api/v1/routes/project");
// const folderRoute = require("./src/api/v1/routes/folder");
// const reportRoute = require("./src/api/v1/routes/report");
// const dashboardRoute = require("./src/api/v1/routes/dashboard");
// const chatRoute = require("./src/api/v1/routes/chat");

//const fileRoutes = require("./src/api/v1/routes/file");

const app = express();
const admin = require("firebase-admin");
const { uploadToS3 } = require("./src/api/v1/services/aws.service");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(helmet());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use(logger("dev"));
}

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(xssClean());

app.use(hpp());

app.use(cors());

app.use(compression());

app.use(cookieParser());

// V1
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/creater-subscription", createrSubscriptionRoutes);
app.use("/api/v1/chat", chatRoute);
// app.use("/api/v1/schedules", scheduleRoute);
// app.use("/api/v1/employees", employeeRoute);
// app.use("/api/v1/projects", projectRoute);
// app.use("/api/v1/folder", folderRoute);
// app.use("/api/v1/report", reportRoute);
// app.use("/api/v1/dashboard", dashboardRoute);
// app.use("/api/v1/chat", chatRoute);

// app.use("/api/v1/file", fileRoutes);
app.post("/upload-image", async (req, res) => {
  const { imageBase64, contentType } = req.body;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const result = await uploadToS3(imageBase64, contentType, baseUrl);

  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(500).json(result);
  }
});

app.use("**", function (req, res, next) {
  next(createError(404));
});

app.use(globalErrorHandler);

module.exports = app;