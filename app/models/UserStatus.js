'use strict';

module.exports = (sequelize, DataTypes) => {

  const UStat = sequelize.define('UStat', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      attainmentName: {
        type: DataTypes.STRING,
      },
      attainmentAmount: {
        type: DataTypes.REAL,
      },
      attainmentDescription:{
        type: DataTypes.STRING
      },

  }, {
    tableName: "userstatus",
    paranoid: true,
    timestamps: true,
  });


  UStat.associate = (models) => {
    UStat.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      as: "users",
    });
  };

  return UStat;
};