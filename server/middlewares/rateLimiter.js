/**
 * Lightweight in-memory rate limiter middleware
 * Provides brute-force and DoS protection for sensitive endpoints
 * without external dependencies.
 */
function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000; // default 15 minutes
  const max = options.max || 100; // default 100 requests per window
  const message = options.message || "Too many requests, please try again later.";
  const hits = new Map();

  // Periodic cleanup to avoid memory leaks
  const cleanupInterval = Math.max(windowMs, 60000);
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(key);
      }
    }
  }, cleanupInterval);

  // Do not hold Node process open for this timer in tests
  if (timer.unref) {
    timer.unref();
  }

  return (req, res, next) => {
    // In test environment, allow bypassing with header if needed
    if (process.env.NODE_ENV === "test" && req.headers["x-bypass-rate-limit"]) {
      return next();
    }

    const ip = req.ip || req.connection?.remoteAddress || req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();

    let record = hits.get(ip);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      hits.set(ip, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader("RateLimit-Limit", max);
    res.setHeader("RateLimit-Remaining", remaining);
    res.setHeader("RateLimit-Reset", resetSeconds);

    if (record.count > max) {
      return res.status(429).json({ message });
    }

    next();
  };
}

module.exports = { createRateLimiter };
