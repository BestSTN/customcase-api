const fs = require("fs");
const validator = require("validator");

const { Product, Order, OrderItem, User } = require("../models");
const AppError = require("../utils/appError");

exports.getUserProduct = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { userId: req.params.id },
    });

    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getUserOrder = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: OrderItem,
    });
    res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exitOrder = await Order.findOne({ where: { id } });
    if (!exitOrder) {
      throw new AppError("order not found", 400);
    }
    if (exitOrder.userId !== req.user.id) {
      throw new AppError("no permission", 403);
    }

    await Order.update({ deliveryStatus: true }, { where: { id } });
    exitOrder.deliveryStatus = true;

    res.status(200).json({ order: exitOrder });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { username, email, password, role, ...updateValue } = req.body;

    if (updateValue.phone && !validator.isMobilePhone(updateValue.phone + "")) {
      throw new AppError("phone number is invalid", 400);
    }

    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ["password"] },
    });

    if (req.file) {
      updateValue.profileImage = req.file.path;
      if (user.profileImage) {
        fs.unlinkSync(user.profileImage);
      }
    }

    await User.update(updateValue, { where: { id: req.user.id } });
    res.status(200).json({ user: { ...user.dataValues, ...updateValue } });
  } catch (err) {
    next(err);
  }
};
