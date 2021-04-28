const express = require("express");
const db = require("../models");
const Op = db.Sequelize.Op;

// Middlewares
const auth = require("../middlewares/auth");

//auth
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");

//Roles
const { UserRolls } = require("../helpers/enum");

const app = express.Router();

//**************Route Level 1

// Login
app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  // Search user
  db.User.findOne({
    where: {
      email,
    },
  })
    .then((user) => {
      if (bcrypt.compareSync(password, user.password)) {
        //We create the token
        let token = jwt.sign({ user: user }, authConfig.secret, {
          expiresIn: authConfig.expires,
        });

        user.password = "";

        return res.json({
          user: user,
          token: token,
        });
      } else {
        // Unauthorized Access
        return res.status(401).json({ msg: "Incorrect password" });
      }
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

module.exports = app;
