const {
  createUserDao,
  getUsersDao,
  getUserDao,
  updateUserDao,
  deleteUserDao,
} = require("../dao/user.dao");
const HttpError = require("../utils/HttpError");

// CREATE
const createUser = async (req, res, next) => {
  try {
    const user = await createUserDao(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// GET USERS
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const sortQuery = req.query.sort || "-createdAt";
    const sortBy = {};
    let field = sortQuery;
    let order = 1;

    if (sortQuery.startsWith("-")) {
      field = sortQuery.substring(1);
      order = -1;
    }

    const allowedSortFields = ["name", "email", "createdAt"];
    if (allowedSortFields.includes(field)) {
      sortBy[field] = order;
    } else {
      sortBy.createdAt = -1;
    }

    const { users, total } = await getUsersDao(
      page,
      limit,
      search,
      sortBy
    );

    res.json({
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET ONE USER
const getUser = async (req, res, next) => {
  try {
    const user = await getUserDao(req.params.id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// UPDATE USER
const updateUser = async (req, res, next) => {
  try {
    const user = await updateUserDao(req.params.id, req.body);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// DELETE USER
const deleteUser = async (req, res, next) => {
  try {
    const deleted = await deleteUserDao(req.params.id);
    if (!deleted) {
      throw new HttpError(404, "User not found");
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
