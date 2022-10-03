module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: DataTypes.STRING,
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
    },
    {
      underscored: true,
    }
  );

  Product.associate = (db) => {
    Product.belongsTo(db.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    Product.belongsTo(db.Model, {
      foreignKey: {
        name: "modelId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    Product.hasMany(db.OrderItem, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Product;
};
