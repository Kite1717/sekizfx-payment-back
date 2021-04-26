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
const axios = require("axios");

const querystring = require("querystring");
const app = express.Router();

//**************Route Level 1

// types
//0 deposit
//1 withdraw
//2 withdraw cancel

//status
//0 pending
//1 success
//2 time out

//find user
app.post("/deposit", async (req, res) => {
  const { name, userId, tc, amount, from, to } = req.body;

  //   BUID={User ID}
  // BCSubID={Test Trader Api Key}
  // Name={User Name and Surname}
  // TC={User Turkish Identity}
  // PGTransactionID={ProcessID}
  // BCID={Test BCID}   q2JXZZxbmkl3r2ag26fpjbGy2K

  //sekizfx_payment	12345678

  let PGTransactionID = makeid(15);
  let url = "http://145.239.255.238:188/send?";

  url += querystring.stringify({
    BUID: userId.toString().trim(),
    BCSubID: "12345678",
    Name: name.trim(),
    TC: tc.toString().trim(),
    PGTransactionID: PGTransactionID.trim(),
    BCID: "q2JXZZxbmkl3r2ag26fpjbGy2K",
  });
  axios
    .get(url)
    .then((response) => {
      console.log(response.data.success, "wwwwwwww");
      if (response.data.success) {
        db.Payments.create({
          from,
          to,
          status: 0,
          type: 0,
          amount,
          creatorUserId: userId,
          createdAt: new Date(),
          processID: PGTransactionID,
          name,
          tc,
        })
          .then(() => {
            return res.json({
              status: 1,
              data: response.data,
            });
          })
          .catch((err) => {
            return res.json({ msg: "DB error", status: 0 });
          });
      } else {
        return res
          .status(500)
          .json({ msg: "Payment process error", status: 0 });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ err: err, msg: "Payment error", status: 0 });
    });
});

app.get("/my-transfers/:userId", async (req, res) => {
  const { userId } = req.params;

  db.Payments.findAll({ where: { creatorUserId: userId } })
    .then((transfers) => {
      return res.json({
        status: 1,
        transfers: transfers.reverse(),
      });
    })
    .catch(() => {
      return res.status(500).json({ msg: "DB error", status: 0 });
    });
});

app.post("/accept-payment", async (req, res) => {
  const { data } = req.body;

  const clbData = data[0];

  // Deposit call back
  //  [{"ProcessID":"test12345678","Type": "Deposit","Status": 1,"Amnt": 100,"URefID": "testUser12345","BCSubID": "APItest1234567890"}]

  // WithDraw call back
  //  [{"ProcessID":"test12345678","Type": "Draw","Status": 1,"Amnt": 100,"URefID": "testUser12345","BCSubID": "APItest1234567890"}]

  // WithDraw cancel call back
  // [{"ProcessID":"test12345678","Type": "Draw","Status": 0,"Amnt": 100,"URefID": "testUser12345","BCSubID": "APItest1234567890"}]

  //0 deposit
  //1 withdraw
  //2 withdraw cancel
  let type = -1;

  if (clbData.Type === "Deposit") {
    // yatırma başarılı
    type = 0;
  } else if (clbData.Type === "Draw" && clbData.Status === 1) {
    // çekim başarılı
    type = 1;
  } else if (clbData.Type === "Draw" && clbData.Status === 0) {
    // çekim iptal
    type = 2;
  }

  // from,
  // to,
  // status: 0,
  // type: 0,
  // amount,
  // creatorUserId: userId,
  // createdAt: new Date(),
  // processID: PGTransactionID,
  // name,
  // tc,

  db.Payments.update(
    { amount: clbData.Amnt, status: 1 },
    {
      where: {
        processID: clbData.ProcessID,
        type,
        creatorUserId: clbData.URefID,
      },
    }
  )
    .then(() => {
      return res.json({
        status: 1,
      });
    })
    .catch(() => {
      return res.status(500).json({ msg: "DB error", status: 0 });
    });
});

//helper
const makeid = (length) => {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
};

module.exports = app;
