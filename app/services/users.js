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



// get auth sign
app.post("/auth-sign", async (req, res) => {

  const {email} = req.body;
   db.User.findOne({
    where:{
      email ,
    }
  }).then((user) => {

    if(user)
    {
      return res.json({
       status : 1,
       authSign : user.authSign
      });
    }
    else{
      return res.status(500).json({ msg : "User not Found" , status : 0});
    }
     
    })
    .catch((err) => {
      return res.status(500).json({err :err , msg : "DB error" , status : 0});
    });
});

// get all settting
app.get("/setting/all", async (req, res) => {

  db.Setting.findAll().then((settings) => {
    
        return res.json({
         status : 1,
         settings,
        });
     
    })
    .catch((err) => {
      return res.status(500).json({err :err , msg : "DB error" , status : 0});
    });
});


// get all settting
app.get("/setting/:name", async (req, res) => {

  console.log("asdasdasdas")
  db.Setting.findOne({
    where : {
      name : req.params.name
    }
  }).then((setting) => {
    
        return res.json({
         status : 1,
         setting,
        });
     
    })
    .catch((err) => {
      return res.status(500).json({err :err , msg : "DB error" , status : 0});
    });
});



// get all settting
app.put("/setting/update", async (req, res) => {

  const data = req.body
  db.Setting.update(data,{
    where:{
      name: data.name
    }
  }).then(() => {
    
        return res.json({
         status : 1,
        });
     
    })
    .catch((err) => {
      return res.status(500).json({err :err , msg : "DB error" , status : 0});
    });
});









module.exports = app;
