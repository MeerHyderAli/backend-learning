const validateCreateUser = (req, res, next) => {
  const { name, email, age } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (age !== undefined && (Number(age) < 0 || isNaN(Number(age)))) {
    return res.status(400).json({ error: "Age must be a positive number" });
  }

  next();
};

const validateUpdateUser = (req, res, next) => {
  const { name, email, age } = req.body;

  if (!name && !email && age === undefined) {
    return res.status(400).json({
      error: "At least one field is required to update",
    });
  }

  if (name && typeof name !== "string") {
    return res.status(400).json({ error: "Name must be a string" });
  }

  if (email && !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (age !== undefined && (Number(age) < 0 || isNaN(Number(age)))) {
    return res.status(400).json({ error: "Age must be a positive number" });
  }

  next();
};

module.exports = {
  validateCreateUser,
  validateUpdateUser,
};
