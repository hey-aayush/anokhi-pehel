const { verifyToken } = require("../config/secret");
const User = require("../models/User");

/**
 * Authentication Middleware
 * Follows Ostina-Freight auth standards:
 * - Accepts both standard 'Bearer <token>' and raw token formats
 * - Verifies signature and expiration
 * - Confirms user exists and is active in database
 * - Excludes password from request context
 */
const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = verifyToken(authHeader);
    const userId = decoded.user?.id || decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token payload" });
    }

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    if (user.isActive === false) {
      return res.status(401).json({ message: "Unauthorized - Account is inactive" });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
  }
};

/**
 * Admin Middleware
 * Follows Ostina-Freight admin authorization pattern:
 * - Ensures user is authenticated and holds an admin or coordinator role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const role = req.user.role || "";
  const isAdmin =
    req.user.isAdmin === true ||
    role === "Coordinator" ||
    role === "Final Year Coordinator" ||
    role.toLowerCase() === "admin";

  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden - Administrator access required" });
  }

  next();
};

module.exports = verifyUser;
module.exports.verifyUser = verifyUser;
module.exports.requireAdmin = requireAdmin;
