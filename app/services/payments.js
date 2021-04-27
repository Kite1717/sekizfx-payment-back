const express = require("express");
const db = require("../models");
const Op = db.Sequelize.Op;

// Middlewares
const auth = require("../middlewares/auth");

//payments

const payment_infos = require("../../config/payment");

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

  //security control

  const ANINDA_HAVALE = payment_infos.ANINDA_HAVALE;
  const ANINDA_HAVALE_BCID = payment_infos.ANINDA_HAVALE_BCID;
  const ANINDA_HAVALE_BCSUBID = payment_infos.ANINDA_HAVALE_BCSUBID;

  const JET_PAPARA = payment_infos.JET_PAPARA;
  const JET_PAPARA_BCID = payment_infos.JET_PAPARA_BCID;
  const JET_PAPARA_BCSUBID = payment_infos.JET_PAPARA_BCSUBID;

  const ANINDA_MEFETE = payment_infos.ANINDA_MEFETE;
  const ANINDA_MEFETE_BCID = payment_infos.ANINDA_MEFETE_BCID;
  const ANINDA_MEFETE_BCSUBID = payment_infos.ANINDA_MEFETE_BCSUBID;

  const ANINDA_KREDI_KARTI = payment_infos.ANINDA_KREDI_KARTI;
  const ANINDA_KREDI_KARTI_BCID = payment_infos.ANINDA_KREDI_KARTI_BCID;
  const ANINDA_KREDI_KARTI_BCSUBID = payment_infos.ANINDA_KREDI_KARTI_BCSUBID;

  // { title: "Anında Kredi Kartı", key: "APID59beRzS7Xhlot61C", id: 1 },
  // { title: "Anında Havale", key: "APIvzIzTPV5RpuIMDhCX", id: 2 },
  // { title: "Jet Papara", key: "APIu8OqRGyI2ovtuw2oO", id: 3 },
  // { title: "Anında Mefete", key: "APIlfMbLjPcJ7Tx3WN8c", id: 4 },

  let BCID = "";
  let baseUrl = "";

  //security control
  if (from.id === 1 && from.key === ANINDA_KREDI_KARTI_BCSUBID) {
    BCID = ANINDA_KREDI_KARTI_BCID;
    baseUrl = ANINDA_KREDI_KARTI;
  } else if (from.id === 2 && from.key === ANINDA_HAVALE_BCSUBID) {
    BCID = ANINDA_HAVALE_BCID;
    baseUrl = ANINDA_HAVALE;
  } else if (from.id === 3 && from.key === JET_PAPARA_BCSUBID) {
    BCID = JET_PAPARA_BCID;
    baseUrl = JET_PAPARA;
  } else if (from.id === 4 && from.key === ANINDA_MEFETE_BCSUBID) {
    BCID = ANINDA_MEFETE_BCID;
    baseUrl = ANINDA_MEFETE;
  } else {
    return res.status(500).json({ msg: "SECURITY AUTH ERROR", status: 0 });
  }

  //   BUID={User ID}
  // BCSubID={Test Trader Api Key}
  // Name={User Name and Surname}
  // TC={User Turkish Identity}
  // PGTransactionID={ProcessID}
  // BCID={Test BCID}   q2JXZZxbmkl3r2ag26fpjbGy2K

  //sekizfx_payment	12345678

  //Anında Kredi Kartı
  //Anında Havale
  //Jet Papara
  //Anında Mefete

  let PGTransactionID = makeid(15);
  let url = `${baseUrl}/send?`;

  url += querystring.stringify({
    BUID: userId.toString().trim(),
    BCSubID: from.key,
    Name: name.trim(),
    TC: tc.toString().trim(),
    PGTransactionID: PGTransactionID.trim(),
    BCID,
  });
  axios
    .get(url)
    .then((response) => {
      if (response.data.success) {
        db.Payments.create({
          from: from.title,
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
  const ip = getClientIP(req);

  if (!checkValidIpAddress(ip)) {
    return res.status(500).json({ msg: "NOT VALID IP error", status: 0 });
  }
  // db.Data.create({
  //   data: ip,
  // })
  //   .then(() => {
  //     return res.json({
  //       status: 1,
  //       clbData,
  //     });
  //   })
  //   .catch((err) => {
  //     return res.status(500).json({ err, msg: "DB error", status: 0 });
  //   });

  //test data
  // const data = req.body.data;
  //real data
  const data = JSON.parse(req.body.data);

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
    { amount: Number(clbData.Amnt), status: 1 },
    {
      where: {
        processID: clbData.ProcessID,
        type,
        creatorUserId: Number(clbData.URefID),
      },
    }
  )
    .then(() => {
      return res.json({
        status: 1,
      });
    })
    .catch((err) => {
      return res.status(500).json({ err, msg: "DB error", status: 0 });
    });

  //TESTİNG
  //   db.Data.create({ data: data })
  //     .then(() => {
  //       return res.json({
  //         status: 1,
  //         clbData,
  //       });
  //     })
  //     .catch((err) => {
  //       return res.status(500).json({ err, msg: "DB error", status: 0 });
  //     });
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

const checkValidIpAddress = (ip) => {
  //145.239.253.199 anında havale

  //145.239.6.130 jet papara

  // 51.89.21.128 Anında Mefete

  // anında kredi kartı
  // 135.125.137.169
  // 135.125.137.170
  // 135.125.137.171
  // 135.125.137.172
  // 176.31.34.5
  // 176.31.34.6
  // 176.31.34.7
  // 144.217.72.78

  const whiteList = payment_infos.whitelist;
  //for local testing
  // whiteList.push("::1");
  // whiteList.push("::ffff:127.0.0.1");

  const find = whiteList.find((item) => item === ip);
  return find === undefined ? false : true;
};

const getClientIP = (req) => {
  return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
};

module.exports = app;
