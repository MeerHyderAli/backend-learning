const User = require("../models/user.model");

/**
 * LOGIN ONLY
 * Fetch user WITH password
 */
const getUserWithPasswordByEmailDao = (email) => {
  return User.findOne({ email });
};

/**
 * Store refresh token
 */
const addRefreshTokenDao = async (userId, refreshToken) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $push: {
        refreshTokens: { token: refreshToken },
      },
    }
  );
};

/**
 * Remove refresh token (logout / rotation)
 */
const removeRefreshTokenDao = async (refreshToken) => {
  return User.findOneAndUpdate(
    { "refreshTokens.token": refreshToken },
    {
      $pull: {
        refreshTokens: { token: refreshToken },
      },
    }
  );
};

/**
 * Find user by refresh token
 */
const findUserByRefreshTokenDao = (refreshToken) => {
  return User.findOne({ "refreshTokens.token": refreshToken });
};

module.exports = {
  getUserWithPasswordByEmailDao,
  addRefreshTokenDao,
  removeRefreshTokenDao,
  findUserByRefreshTokenDao,
};
