import express from "express";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";

import { initializeSocket } from "./lib/socket.js";

import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";


const __dirname = path.resolve();
const app = express();

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

initializeSocket(httpServer);

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();

  const requestId = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  req.requestId = requestId;

  console.log(`\n[${requestId}] → ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    const log = [
      `[${requestId}] ← ${req.method} ${req.originalUrl}`,
      `${status}`,
      `${duration}ms`,
    ].join(" | ");

    if (status >= 500) {
      console.error(log);
    } else if (status >= 400) {
      console.warn(log);
    } else {
      console.log(log);
    }
  });

  next();
});


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://streamify-music-app-kappa.vercel.app",
    ],
    credentials: true,
  })
);


// Body Parser
app.use(express.json());

// Clerk Authentication
app.use(
  clerkMiddleware({
    debug: true,
  })
);

// File Upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,

    limits: {
      fileSize: 50 * 1024 * 1024,
    },

    abortOnLimit: true,

    responseOnLimit: "File size exceeds the 50MB upload limit.",
  })
);

// Temporary Directory
const tempDir = path.join(__dirname, "tmp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Temporary File Cleanup
cron.schedule("0 * * * *", () => {
  if (!fs.existsSync(tempDir)) {
    return;
  }

  fs.readdir(tempDir, (err, files) => {
    if (err) {
      console.error("Error reading temp directory:", err);
      return;
    }

    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(tempDir, file);

      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          return;
        }

        const fileAge = now - stats.mtimeMs;

        if (fileAge > 60 * 60 * 1000) {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(
                `Error deleting temporary file ${file}:`,
                unlinkErr
              );
            }
          });
        }
      });
    }
  });
});

// Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

// Production Frontend
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Error Handler
app.use((err, req, res, _next) => {
  console.error(
    `[${req.requestId || "unknown"}] Server error:`,
    err
  );

  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      message: "File is too large. Maximum upload size is 50MB.",
    });
  }

  return res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// Start Server
httpServer.listen(PORT, () => {
  console.log("==============================================");
  console.log("🎵 Streamify Backend");
  console.log("==============================================");
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
  console.log(
    `🌍 Environment: ${process.env.NODE_ENV || "development"}`
  );
  console.log("==============================================");

  connectDB();
});