const validator = require("validator");

const {
  User,
  Order,
  OrderItem,
  Product,
  Model,
  sequelize,
} = require("../models");
const AppError = require("../utils/appError");

exports.getAllOrder = async (req, res, next) => {
  try {
    const admin = await User.findOne({
      where: { id: req.user.id, role: "ADMIN" },
    });
    if (!admin) {
      throw new AppError("no permission", 403);
    }

    const orders = await Order.findAll({
      include: {
        model: OrderItem,
        include: {
          model: Product,
          paranoid: false,
          include: { model: Model, attributes: ["name"] },
        },
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { address, orderItems } = req.body;

    if (!address || !address.trim()) {
      throw new AppError("address is required", 400);
    }

    if (!Array.isArray(orderItems) || !orderItems.length) {
      throw new AppError("order is invalid", 400);
    }

    const order = await Order.create(
      { address, userId: req.user.id },
      { transaction: t }
    );

    orderItems.forEach((orderItem) => {
      if (
        !validator.isNumeric(orderItem.amount + "") ||
        orderItem.amount <= 0
      ) {
        throw new AppError("amount is invalid", 400);
      }

      if (!validator.isNumeric(orderItem.price + "") || orderItem.price <= 0) {
        throw new AppError("price is invalid", 400);
      }

      if (!orderItem.productId) {
        throw new AppError("product is invalid", 400);
      }

      orderItem.orderId = order.id;
    });

    order.dataValues.OrderItems = await OrderItem.bulkCreate(orderItems, {
      transaction: t,
    });
    await t.commit();

    // const newOrder = await Order.findOne({
    //   where: { id: order.id },
    //   include: { model: OrderItem },
    // });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin = await User.findOne({
      where: { id: req.user.id, role: "ADMIN" },
    });
    if (!admin) {
      throw new AppError("no permission", 403);
    }

    const exitOrder = await Order.findOne({
      where: { id },
      include: {
        model: OrderItem,
        include: {
          model: Product,
          paranoid: false,
          include: { model: Model, attributes: ["name"] },
        },
      },
    });
    if (!exitOrder) {
      throw new AppError("order not found", 400);
    }

    await Order.update(
      { transactionStatus: !exitOrder.transactionStatus },
      { where: { id } }
    );
    exitOrder.transactionStatus = !exitOrder.transactionStatus;

    res.status(200).json({ order: exitOrder });
  } catch (err) {
    next(err);
  }
};
