'use strict';

module.exports = (sequelize, DataTypes) => {

  const Answer = sequelize.define('Answer', {
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
      exerciseId: {
        type: DataTypes.INTEGER,
        references: { model: 'bookexercises', key: 'id' }
      },
      isTrue:{
        type: DataTypes.BOOLEAN,
        defaultValue:false,
      }

  }, {
    tableName: "answers",
    paranoid: true,
    timestamps: true,
  });

  Answer.associate = (models) => {
    Answer.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      as: "users",
    });

    Answer.belongsTo(models.BookEx, {
        foreignKey: {
          name: "exerciseId",
          allowNull: false,
        },
        as: "exercises",
      });
  };

  return Answer;
};