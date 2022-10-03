const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const { User } = require("../models");
const AppError = require("../utils/appError");

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY || "secret_key", {
    expiresIn: process.env.JWT_EXPIRES || "1d",
  });

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, password, confirmPassword } =
      req.body;

    if (!firstName || !firstName.trim()) {
      throw new AppError("firstName is required", 400);
    }
    if (!lastName || !lastName.trim()) {
      throw new AppError("lastName is required", 400);
    }
    if (!username || !username.trim()) {
      throw new AppError("username is required", 400);
    }
    if (password !== confirmPassword) {
      throw new AppError("password and confirm password did not match", 400);
    }
    if (!validator.isEmail(email)) {
      throw new AppError("email is invalid", 400);
    }
    const isThereUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });
    if (isThereUser) {
      throw new AppError("already have this username or email", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    const token = genToken({ id: user.id });

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });
    if (!user) {
      throw new AppError("email address or mobile or password is invalid", 400);
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      throw new AppError("email address or mobile or password is invalid", 400);
    }

    const token = genToken({ id: user.id });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};
