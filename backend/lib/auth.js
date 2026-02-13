const jwt = require("jsonwebtoken");
const { sendError } = require("./response-helper");

const JWT_SECRET = process.env.JWT_SECRET || "order-food-app-secret-key";

function generateToken(payLoad) {
  return jwt.sign(payLoad, JWT_SECRET, { expiresIn: "7d" });
}

function authUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return sendError(res, 401, "Authentication required.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "user") {
      return sendError(res, 403, "Access denied. User account required");
    }

    req.user = decoded;
    next();
  } catch (e) {
    return sendError(res, 401, "Invalid or expired token.");
  }
}

function authRestaurant(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return sendError(res, 401, "Authentication required.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "restaurant") {
      return sendError(res, 403, "Access denied. Restaurant account required.");
    }

    req.restaurant = decoded;
    next();
  } catch (e) {
    return sendError(res, 401, "Invalid or expired token.");
  }
}

module.exports = { generateToken, authUser, authRestaurant, JWT_SECRET };
