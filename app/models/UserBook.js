'use strict';

module.exports = (sequelize, DataTypes) => {

  const UBook = sequelize.define('UBook', {
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
      bookId: {
        type: DataTypes.INTEGER,
        references: { model: 'books', key: 'id' }
      },

  }, {
    tableName: "usersbooks",
    paranoid: true,
    timestamps: true,
  });


  UBook.associate = (models) => {
    UBook.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      as: "users",
    });

    UBook.belongsTo(models.Book, {
        foreignKey: {
          name: "bookId",
          allowNull: false,
        },
        as: "books",
      });
  };


  return UBook;
};