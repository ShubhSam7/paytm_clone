const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

function middleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({
      message: "Authorization header missing or invalid",
    });
  }

  // Check if the header starts with "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Authorization header must start with 'Bearer '",
    });
  }

  // Extract the token (everything after "Bearer ")
  const token = authHeader.split(" ")[1];

  // Check if token exists after splitting
  if (!token) {
    return res.status(403).json({
      message: "Token missing in Authorization header",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = { middleware };
