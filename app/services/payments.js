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

//Cron
const CronJob = require("cron").CronJob;

//**************Route Level 1

// types
//0 deposit
//1 withdraw

//status
//0 pending
//1 success
//2 time out

//find user
app.post("/deposit", async (req, res) => {
  const { name, userId, tc, amount, btcAmt, from, to } = req.body;

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

  const ANINDA_BTC = payment_infos.ANINDA_BTC;
  const ANINDA_BTC_BCID = payment_infos.ANINDA_BTC_BCID;
  const ANINDA_BTC_BCSUBID = payment_infos.ANINDA_BTC_BCSUBID;

  // { title: "Anında Kredi Kartı", key: "APID59beRzS7Xhlot61C", id: 1 },
  // { title: "Anında Havale", key: "APIvzIzTPV5RpuIMDhCX", id: 2 },
  // { title: "Jet Papara", key: "APIu8OqRGyI2ovtuw2oO", id: 3 },
  // { title: "Anında Mefete", key: "APIlfMbLjPcJ7Tx3WN8c", id: 4 },
  //  { title: "Anında BTC", key: "APIZVwXnuIhhwKsfKl0s", id: 5 },

  let BCID = "";
  let baseUrl = "";
  let BCSubID = "";

  //security control
  if (from.id === 1 ) {
    BCID = ANINDA_KREDI_KARTI_BCID;
    baseUrl = ANINDA_KREDI_KARTI;
    BCSubID = ANINDA_KREDI_KARTI_BCSUBID;
  } else if (from.id === 2) {
    BCID = ANINDA_HAVALE_BCID;
    baseUrl = ANINDA_HAVALE;
    BCSubID = ANINDA_HAVALE_BCSUBID;
  } else if (from.id === 3 ) {
    BCID = JET_PAPARA_BCID;
    baseUrl = JET_PAPARA;
    BCSubID = JET_PAPARA_BCSUBID;
  } else if (from.id === 4) {
    BCID = ANINDA_MEFETE_BCID;
    baseUrl = ANINDA_MEFETE;
    BCSubID = ANINDA_MEFETE_BCSUBID;
  } else if (from.id === 5) {
    BCID = ANINDA_BTC_BCID;
    baseUrl = ANINDA_BTC;
    BCSubID = ANINDA_BTC_BCSUBID;
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
  let url = `${baseUrl}send?`;

  url += querystring.stringify({
    BUID: userId.toString().trim(),
    BCSubID,
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
          btcAmt,
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
        return res.status(500).json({
          data: response.data,
          msg: "Payment process error",
          status: 0,
        });
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ err: err, msg: "Payment error", status: 0 });
    });
});


//withdraw request
app.post("/wd-request", async (req, res) => {
  const { name, userId, tc, amount, from, to, iban, bankId } = req.body;

  db.WReq.create({
    from: from.title,
    to,
    amount,
    userId: userId,
    createdAt: new Date(),
    name,
    tc,
    iban,
    bankId,
  })
    .then(() => {
      return res.json({
        status: 1,
      });
    })
    .catch((err) => {
      return res.json({ err, msg: "DB error", status: 0 });
    });
});


//get withdraw requests


//status 0 pending
//status 1 accept
//status 2 cancel
app.get("/all-wd-request", async (req, res) => {
  db.WReq.findAll({
    order: [["id", "DESC"]],
  })
    .then((reqs) => {
      return res.json({
        status: 1,
        requests: reqs,
      });
    })
    .catch(() => {
      return res.status(500).json({ msg: "DB error", status: 0 });
    });
});


//cancel request
app.put("/update-wd-request", async (req, res) => {
  const {id,status} = req.body;
  db.WReq.update({
    status,

  },{
    where: {
      id,
    }
  })
    .then(() => {
      return res.json({
        status: 1,
      });
    })
    .catch(() => {
      return res.status(500).json({ msg: "DB error", status: 0 });
    });
});




//with draw process
app.post("/wd-wd-wd",auth([UserRolls.Admin]), async (req, res) => {
  const { name, userId, tc, amount, from, to, iban, bankId } = req.body;

  if(!req.user)
  {
    return res.status(500).json({ msg: "SECURITY AUTH ERROR", status: 0 });
  }
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

  const ANINDA_BTC = payment_infos.ANINDA_BTC;
  const ANINDA_BTC_BCID = payment_infos.ANINDA_BTC_BCID;
  const ANINDA_BTC_BCSUBID = payment_infos.ANINDA_BTC_BCSUBID;

  let BCID = "";
  let baseUrl = "";
  let BCSubID = "";

  //security control
  if (from.id === 1 ) {
    BCID = ANINDA_KREDI_KARTI_BCID;
    baseUrl = ANINDA_KREDI_KARTI;
    BCSubID = ANINDA_KREDI_KARTI_BCSUBID;
  } else if (from.id === 2) {
    BCID = ANINDA_HAVALE_BCID;
    baseUrl = ANINDA_HAVALE;
    BCSubID = ANINDA_HAVALE_BCSUBID;
  } else if (from.id === 3 ) {
    BCID = JET_PAPARA_BCID;
    baseUrl = JET_PAPARA;
    BCSubID = JET_PAPARA_BCSUBID;
  } else if (from.id === 4) {
    BCID = ANINDA_MEFETE_BCID;
    baseUrl = ANINDA_MEFETE;
    BCSubID = ANINDA_MEFETE_BCSUBID;
  } else if (from.id === 5) {
    BCID = ANINDA_BTC_BCID;
    baseUrl = ANINDA_BTC;
    BCSubID = ANINDA_BTC_BCSUBID;
  } else {
    return res.status(500).json({ msg: "SECURITY AUTH ERROR", status: 0 });
  }

  /* BUID={User ID}
  BCSubID={Test Trader Api Key}
  Name={User Name and Surname}
  TC={User Turkish Identity}
  IBAN={Bank IBAN,Papara No, Creditcard No}
  DRefID={Draw TransactionID}
  Amount={Draw Amount}
  BanksID={Draw BanksID}
  BCID={Test BCID}*/

  let DRefID = makeid(15);
  let url = `${baseUrl}send/uwdraw?`;

  url += querystring.stringify({
    BUID: userId.toString().trim(),
    BCSubID,
    Name: name.trim(),
    TC: tc.toString().trim(),
    IBAN: iban.toString().trim(),
    DRefID: DRefID.trim(),
    Amount: amount,
    BanksID: bankId.toString().trim(),
    BCID,
  });

  axios
    .get(url)
    .then((response) => {
      const q = JSON.stringify(response.data);
      if (q.includes("true")) {
        db.Payments.create({
          from: from.title,
          to,
          status: 0,
          type: 1,
          amount,
          creatorUserId: userId,
          createdAt: new Date(),
          processID: DRefID,
          name,
          tc,
          iban,
          bankId,
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
        return res.status(500).json({
          data: response.data,
          msg: "Payment process error",
          status: 0,
        });
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

  db.Payments.findAll({
    order: [["id", "DESC"]],
    where: { creatorUserId: userId },
  })
    .then((transfers) => {
      return res.json({
        status: 1,
        transfers: transfers,
      });
    })
    .catch(() => {
      return res.status(500).json({ msg: "DB error", status: 0 });
    });
});

app.get("/all-transfers", async (req, res) => {
  db.Payments.findAll({
    order: [["id", "DESC"]],
  })
    .then((transfers) => {
      return res.json({
        status: 1,
        transfers: transfers,
      });
    })
    .catch(() => {
      return res.status(500).json({ msg: "DB error", status: 0 });
    });
});

app.post("/accept-payment", async (req, res) => {
  const ip = getClientIP(req);

  //ip log
  db.Data.create({
    data: ip,
  })
    .then(() => {
      return res.json({
        status: 1,
      });
    })
    .catch((err) => {
      return res.status(500).json({ err, msg: "DB error", status: 0 });
    });

  if (!checkValidIpAddress(ip)) {
    return res.status(500).json({ msg: "NOT VALID IP error", status: 0 });
  }

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

  let status = null;
  if (clbData.Type === "Deposit") {
    // yatırma başarılı
    type = 0;
  } else if (clbData.Type === "Draw") {
    type = 1;
    // çekim başarılı
    if (clbData.Status === 1) {
      status = 1;
    } else {
      // çekim iptal  status = 2

      status = 2;
    }
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

  /// BTC CALLBACK
  /*
  [{"ProcessID":"test12345678","Type": "Deposit","Status": 1,"Amnt": 100,
  "URefID": "testUser12345","BCSubID": "APItest1234567890","BTC":0.000123,
  "TxID":"1c6986e7c5096462958974b4ee8bf64f9bcabe8e8ecd0ef5e8c7571816b6addf"}]
  */

  if (clbData.TxID !== null && clbData.TxID !== undefined) {
    // btc payment system
    db.Payments.findAll({
      order: [["id", "DESC"]],
      where: {
        type,
        processID: clbData.ProcessID,
        creatorUserId: Number(clbData.URefID),
        txID: {
          // dışardan gelen anlamını katar
          [Op.ne]: null,
        },
      },
    })
      .then((pays) => {
        if (pays !== null && pays !== undefined && pays.length > 0) {
          // daha önceden işlem geçmiş
          //dışarıdan gelen işlem
          let lastPay = pays[0];
          db.Payments.create({
            from: lastPay.from,
            to: lastPay.to,
            status: 1,
            type: lastPay.type,
            amount: Number(clbData.Amnt),
            btcAmt: isNaN(Number(clbData.BTC)) ? 0 : Number(clbData.BTC),
            creatorUserId: lastPay.creatorUserId,
            createdAt: new Date(),
            processID: lastPay.processID,
            name: lastPay.name,
            tc: lastPay.tc,
            txID: clbData.TxID,
          })
            .then(() => {
              return res.json({
                status: 1,
              });
            })
            .catch((err) => {
              return res.status(500).json({ err, msg: "DB error", status: 0 });
            });
        } else {
          /// bulamadıysa bu processID nin callbackdir dışarıdan değildir.
          db.Payments.update(
            {
              amount: Number(clbData.Amnt),
              status: status !== null ? status : 1,
              txID: clbData.TxID,
              btcAmt: isNaN(Number(clbData.BTC)) ? 0 : Number(clbData.BTC),
            },
            {
              where: {
                processID: clbData.ProcessID,
                type,
                status: 0,
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
        }
      })
      .catch((err) => {
        return res.status(500).json({ err, msg: "DB error", status: 0 });
      });
  } else {
    //other payment system
    let uptDta = {
      amount: Number(clbData.Amnt),
      status: status !== null ? status : 1,
    };
    db.Payments.update(uptDta, {
      where: {
        processID: clbData.ProcessID,
        type,
        status: 0,
        creatorUserId: Number(clbData.URefID),
      },
    })
      .then(() => {
        return res.json({
          status: 1,
        });
      })
      .catch((err) => {
        return res.status(500).json({ err, msg: "DB error", status: 0 });
      });
  }

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

  //37.187.144.33 Anında BTC

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
  //whiteList.push("::ffff:127.0.0.1");
  whiteList.push("31.223.26.138");
  const find = whiteList.find((item) => item === ip);
  return find === undefined ? false : true;
};

const getClientIP = (req) => {
  const ipRaw = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (ipRaw.includes(",")) {
    return ipRaw.split(",")[0];
  } else {
    return ipRaw;
  }
};

//cron job detect time out transactions
const job = new CronJob("0 */1 * * * *", function () {
  const d = new Date();

  db.Payments.findAll({
    where: {
      status: 0,
    },
  }).then((transfers) => {
    let detectedTransfers = [];
    const now = new Date();
    for (let i = 0; i < transfers.length; i++) {
      const createdAt = new Date(transfers[i].createdAt);

      if (now - createdAt > 86400000 && transfers[i].type !== 1) {
        detectedTransfers.push(transfers[i].processID);
      }
    }

    db.Payments.update(
      { status: 2 },
      { where: { processID: detectedTransfers } }
    );
  });
  console.log("At One Minutes:", d);
});
job.start();

module.exports = app;
