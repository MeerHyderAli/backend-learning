const jwt = require("jsonwebtoken");
const HttpError = require("../utils/HttpError");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    // 1️⃣ Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Not authenticated");
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch {
      throw new HttpError(401, "Invalid or expired token");
    }

    // 4️⃣ Find user
    const user = await User.findById(payload.sub)
      .select("-password -refreshTokens");

    if (!user) {
      throw new HttpError(401, "User not found");
    }

    // 5️⃣ Attach user to request
    req.user = user;

    // 6️⃣ Allow request
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = protect;
