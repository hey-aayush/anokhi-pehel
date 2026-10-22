const mongoose = require("mongoose");

const getDatabaseStatus = () => {
  const state = mongoose.connection.readyState;
  switch (state) {
    case 1:
      return { status: "connected", readyState: 1 };
    case 2:
      return { status: "connecting", readyState: 2 };
    case 3:
      return { status: "disconnecting", readyState: 3 };
    case 0:
    default:
      return { status: "disconnected", readyState: 0 };
  }
};

const getHealthStatus = (req, res) => {
  const dbStatus = getDatabaseStatus();
  const isHealthy = dbStatus.readyState === 1 || process.env.NODE_ENV === "test";
  const memory = process.memoryUsage();

  const healthData = {
    status: isHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || "development",
    database: dbStatus,
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsageMB: {
        rss: Math.round(memory.rss / (1024 * 1024)),
        heapTotal: Math.round(memory.heapTotal / (1024 * 1024)),
        heapUsed: Math.round(memory.heapUsed / (1024 * 1024)),
      },
    },
  };

  const statusCode = isHealthy ? 200 : 503;
  return res.status(statusCode).json(healthData);
};

module.exports = {
  getHealthStatus,
  getDatabaseStatus,
};
