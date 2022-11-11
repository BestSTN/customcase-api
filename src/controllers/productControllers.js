const fs = require("fs");
const { Product, User, Model } = require("../models");
const validator = require("validator");
const AppError = require("../utils/appError");

exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      attributes: { exclude: ["userId", "modelId"] },
      include: [
        { model: User, attributes: { exclude: "password" } },
        { model: Model },
      ],
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, modelId } = req.body;

    if (!name || !name.trim()) {
      throw new AppError("name is required", 400);
    }

    const image = req.files.image[0].path;
    const thumbnail = req.files.thumbnail[0].path;

    if (!image || !thumbnail) {
      throw new AppError("image or thumbnail is invalid", 400);
    }

    if (!validator.isNumeric(price + "")) {
      throw new AppError("price must be number", 400);
    }

    const newProduct = await Product.create({
      name,
      image,
      thumbnail,
      description,
      price,
      modelId,
      userId: req.user.id,
    });
    const product = await Product.findOne({
      where: { id: newProduct.id },
      attributes: { exclude: ["userId", "modelId"] },
      include: [
        { model: User, attributes: { exclude: "password" } },
        { model: Model },
      ],
    });

    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateValue = req.body;
    const product = await Product.findOne({
      where: { id },
    });

    if (!product) {
      throw new AppError("product not found", 400);
    }

    if (req.user.id !== product.userId) {
      throw new AppError("no permission to update", 403);
    }

    // if (req.files.image) {
    //   updateValue.image = req.files.image[0].path;
    //   if (product.image) {
    //     fs.unlinkSync(product.image);
    //   }
    // }
    // if (req.files.thumbnail) {
    //   updateValue.thumbnail = req.files.thumbnail[0].path;
    //   if (product.thumbnail) {
    //     fs.unlinkSync(product.thumbnail);
    //   }
    // }

    await Product.update(updateValue, { where: { id } });
    res
      .status(200)
      .json({ product: { ...product.dataValues, ...updateValue } });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw new AppError("product was not found", 400);
    }
    if (req.user.id !== product.userId && req.user.role !== "ADMIN") {
      throw new AppError("no permission to delete", 403);
    }

    await Product.destroy({ where: { id } });
    res.status(200).json({ message: "success delete" });
  } catch (err) {
    next(err);
  }
};
