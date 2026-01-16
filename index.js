const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConfig");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const { errorHandler } = require("./middlewares/error.handler");

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
