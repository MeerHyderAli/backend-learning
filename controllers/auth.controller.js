const jwt = require("jsonwebtoken");
const HttpError = require("../utils/HttpError");

const {
  getUserWithPasswordByEmailDao,
  addRefreshTokenDao,
  removeRefreshTokenDao,
  findUserByRefreshTokenDao,
} = require("../dao/auth.dao");

/* TOKEN HELPERS */

const generateAccessToken = (userId) =>
  jwt.sign(
    { sub: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

const generateRefreshToken = (userId) =>
  jwt.sign(
    { sub: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

/* LOGIN */

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await getUserWithPasswordByEmailDao(email);
    if (!user) throw new HttpError(401, "Invalid credentials");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new HttpError(401, "Invalid credentials");

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await addRefreshTokenDao(user._id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* REFRESH */

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new HttpError(401, "No refresh token");

    let payload;
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );
    } catch {
      throw new HttpError(401, "Invalid refresh token");
    }

    const user = await findUserByRefreshTokenDao(refreshToken);
    if (!user) throw new HttpError(401, "Token revoked");

    await removeRefreshTokenDao(refreshToken);

    const newRefreshToken = generateRefreshToken(user._id);
    await addRefreshTokenDao(user._id, newRefreshToken);

    const accessToken = generateAccessToken(user._id);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

/* LOGOUT */

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await removeRefreshTokenDao(refreshToken);
      res.clearCookie("refreshToken");
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { login, refresh, logout };
