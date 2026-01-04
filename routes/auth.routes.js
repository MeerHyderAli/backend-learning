const express = require("express");
const asyncHandler = require("../middlewares/async.handler");
const { login, refresh, logout } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));

module.exports = router;
