'use strict';

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 255],
          msg: "The name must be at least two characters"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      // validate: {
      //   isEmail: {
      //     msg: "The email must be a valid email"
      //   }
      // }
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: "The password must be at least 6 characters long"
        }
      }
    },
    role:{
      type:DataTypes.INTEGER,
      allowNull:false,

    },
    username:{
      allowNull: false,
      type: DataTypes.STRING
    },

  }, {
    tableName: "users",
    paranoid: true,
    timestamps: true,
  });


  return User;
};