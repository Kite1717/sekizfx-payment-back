'use strict';

module.exports = (sequelize, DataTypes) => {

  const BookEx = sequelize.define('BookEx', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      bookId: {
        type: DataTypes.INTEGER,
        references: { model: 'books', key: 'id' }

      },
      exerciseImg: {
        type: DataTypes.STRING,
      },
      exerciseOrderNo: {
        type: DataTypes.INTEGER,
      },
      exerciseAttainmentName: {
        type: DataTypes.STRING,
      },
      exerciseAttainmentName: {
        type: DataTypes.REAL,
      },

  }, {
    tableName: "bookexercises",
    paranoid: true,
    timestamps: true,
  });


  BookEx.associate = (models) => {
    BookEx.belongsTo(models.Book, {
      foreignKey: {
        name: "bookId",
        allowNull: false,
      },
      as: "books",
    });
  };


  return BookEx;
};