// Compatibility shim for Node.js 24+ where SlowBuffer is deprecated/removed
const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

const jwt = require("jsonwebtoken");

const JWT_EXPIRY = "24h";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.JWT_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is required in production");
    }
    // Safe development fallback when environment variable is not yet configured locally
    return "anokhi-pehel-dev-jwt-secret-key-change-in-production";
  }
  return secret;
}

const JWT_KEY = getJwtSecret();

const generateToken = (userId, additionalData = {}) => {
  return jwt.sign(
    { user: { id: userId, ...additionalData } },
    JWT_KEY,
    { expiresIn: JWT_EXPIRY }
  );
};

const verifyToken = (token) => {
  if (!token) {
    throw new Error("No token provided");
  }
  // Standardize: strip 'Bearer ' prefix if present
  const rawToken = token.startsWith("Bearer ") ? token.slice(7).trim() : token.trim();
  return jwt.verify(rawToken, JWT_KEY);
};

// Generate a temporary token valid for only 30 minutes (e.g., password reset)
const generateTempToken = (userId) => {
  return jwt.sign({ user: { id: userId } }, JWT_KEY, { expiresIn: "30m" });
};

module.exports = { generateToken, verifyToken, generateTempToken, JWT_KEY };
