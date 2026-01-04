const User = require("../models/user.model");

/**
 * CREATE USER
 * Password is required here because we are creating a user
 * BUT we still never return password
 */
const createUserDao = async (data) => {
  const user = await User.create(data);

  return User.findById(user._id)
    .select("-password -refreshTokens")
    .lean();
};

/**
 * GET USERS (LIST)
 * NEVER return password or refreshTokens
 */
const getUsersDao = async (page, limit, search, sortBy) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("-password -refreshTokens")
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await User.countDocuments(filter);

  return { users, total };
};

/**
 * GET SINGLE USER
 */
const getUserDao = (id) => {
  return User.findById(id)
    .select("-password -refreshTokens")
    .lean();
};

/**
 * UPDATE USER (PROFILE DATA ONLY)
 * No password updates here
 */
const updateUserDao = async (id, data) => {
  const user = await User.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  )
    .select("-password -refreshTokens");

  return user ? user.toObject() : null;
};

/**
 * DELETE USER
 */
const deleteUserDao = (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = {
  createUserDao,
  getUsersDao,
  getUserDao,
  updateUserDao,
  deleteUserDao,
};
