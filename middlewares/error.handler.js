const mongoose = require("mongoose");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Custom HTTP errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({ errors });
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: `${field} already exists`
    });
  }

  // Fallback
  res.status(500).json({ error: "Internal Server Error" });
};

module.exports = { errorHandler };