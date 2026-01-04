const express = require("express");
const asyncHandler = require("../middlewares/async.handler");
const {
  validateCreateUser,
  validateUpdateUser,
} = require("../middlewares/user.validation");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", validateCreateUser, protect, asyncHandler(createUser));
router.get("/", protect, asyncHandler(getUsers));
router.get("/:id", protect, asyncHandler(getUser));
router.put("/:id", protect, validateUpdateUser, asyncHandler(updateUser));
router.delete("/:id", protect, asyncHandler(deleteUser));

module.exports = router;
