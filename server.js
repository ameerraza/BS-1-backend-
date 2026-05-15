const mongoose = require("mongoose");
const http = require("http");
require("dotenv").config();
const app = require("./app"); 

const socketIo = require('socket.io');
const User = require("./src/api/v1/model/Users");
const SocketService = require("./src/api/v1/sockets/socket.service");
const seedDatabaseAndCreateSuperAdmin = require("./src/api/v1/utils/superAdminCreation");

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.name, err.message);
  process.exit(1);
});

const dbURI = process.env.DEV_DATABASE;
console.log("db_URI ... ", dbURI);

const hasConfiguredMongoUri =
  dbURI && !dbURI.includes("<username>") && !dbURI.includes("<cluster>");

if (hasConfiguredMongoUri) {
  mongoose
    .connect(dbURI, {
      tls: true, // Required for MongoDB Atlas SSL connections
    })
    .then(async () => {
      console.log("✅ MongoDB connected successfully!");

      try {
        const users = await User.find();
        if (users.length === 0) {
          console.log("⚡ No users found. Seeding database with Super Admin...");
          await seedDatabaseAndCreateSuperAdmin();
          console.log("✅ Super Admin created successfully!");
        }
      } catch (error) {
        console.error("❌ Error querying users:", error);
      }
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1); // Exit process on connection failure
    });
} else {
  console.warn("⚠️ Skipping MongoDB connection because DEV_DATABASE is not configured.");
}


const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);
// server.listen(port, () => {
//   console.log(`App running on port ${port}`);
// });

// process.on("unhandledRejection", (err) => {
//   console.error("Unhandled Rejection:", err.name, err.message);
//   process.exit(1);
// });



// Initialize SocketService (make sure your SocketService.js handles IO connections)
SocketService.init(io);
//const chatServiceInstance = new ChatService(io);
// Start the server
server.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.name, err.message);
  process.exit(1);
});



