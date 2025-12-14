import { JWT_SECRET } from "./config";
const jwt = require("jsonwebtoken");

export function middleware(req, res, next) {
  const user = req.body();
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded) {
    return res.status(411).json({
      message: "token is not verified",
    });
  }
  try {
    req.userId = decoded.userId;
    next();
  } catch (e) {
    return res.status(403).json({});
  }
}
