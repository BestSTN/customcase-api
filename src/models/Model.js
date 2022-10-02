module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "Model",
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
      description: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );

  Model.associate = (db) => {
    Model.belongsTo(db.Category, {
      foreignKey: {
        name: "categoryId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    Model.belongsTo(db.Brand, {
      foreignKey: {
        name: "brandId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    Model.hasMany(db.Product, {
      foreignKey: {
        name: "modelId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Model;
};
