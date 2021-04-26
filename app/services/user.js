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

//find user
app.post(
  "/find",
  auth([UserRolls.Admin, UserRolls.Trainer, UserRolls.CompanyAdmin]),
  async (req, res) => {
    const {
      filter,
      pageNumber,
      pageSize,
      sortField,
      sortOrder,
    } = req.body.queryParams;

    //filtering
    const { deviceIdNo, tcNo } = filter;
    let conditions = { role: { [Op.not]: 0 } };
    if (deviceIdNo) {
      conditions.deviceIdNo = { [Op.like]: `%${deviceIdNo}%` };
    }
    if (tcNo) {
      conditions.tcNo = { [Op.like]: `%${tcNo}%` };
    }

    db.User.findAndCountAll({
      order: [[sortField, String(sortOrder.toUpperCase())]],
      limit: pageSize,
      offset: pageSize * (pageNumber - 1),
      where: conditions,
    })
      .then((result) => {
        return res.json({
          type: true,
          totalCount: result.count,
          entities: result.rows,
        });
      })
      .catch((e) => {
        return res.json({
          type: false,
          data: e.toString(),
        });
      });
  }
);

//delete user
app.delete(
  "/:id",
  auth([UserRolls.Admin, UserRolls.Trainer, UserRolls.CompanyAdmin]),
  async (req, res) => {
    const id = req.params.id;
    db.User.update(
      { deleterUserId: req.user.id, deletedAt: new Date() },
      { where: { id: id } }
    )
      .then((result) => {
        return res.json({
          type: true,
          data: "User Deleted",
        });
      })
      .catch((e) => {
        return res.json({
          type: false,
          data: e.toString(),
        });
      });
  }
);

//get token
app.get(
  "/me",
  auth([UserRolls.Admin, UserRolls.Trainer, UserRolls.CompanyAdmin]),
  async (req, res) => {
    if (req.user) {
      return res.json({
        type: true,
        user: req.user,
      });
    } else {
      return res.status(401).json({ msg: "Unauthorized access" });
    }
  }
);

//get user by id
app.get(
  "/:id",
  auth([UserRolls.Admin, UserRolls.Trainer]),
  async (req, res) => {
    const id = req.params.id;
    db.User.findOne({ where: { id } })
      .then((result) => {
        result.isTipAdmin = result.isTipAdmin ? "1" : "0";

        return res.json({
          type: true,
          user: result,
        });
      })
      .catch((e) => {
        return res.json({
          type: false,
          data: e.toString(),
        });
      });
  }
);

//update user
app.put(
  "/:id",
  auth([UserRolls.Admin, UserRolls.Trainer, UserRolls.CompanyAdmin]),
  async (req, res) => {
    const id = req.params.id;

    let password = bcrypt.hashSync(
      req.body.user.tcNo.substr(5),
      Number.parseInt(authConfig.rounds)
    );
    req.body.user.password = password;
    db.User.update(req.body.user, { where: { id: id }, paranoid: false })
      .then((result) => {
        return res.json({
          type: true,
          data: "User Updated",
        });
      })
      .catch((e) => {
        return res.status(500).json({
          type: false,
          data: e.toString(),
        });
      });
  }
);

//sign up
app.post("/new", async (req, res) => {
  const { user: data } = req.body;

  let password = bcrypt.hashSync(
    data.tcNo.substr(5),
    Number.parseInt(authConfig.rounds)
  );

  // Create a user,
  db.User.findOne({ where: { tcNo: data.tcNo }, paranoid: false }).then(
    (user) => {
      if (user && user.deletedAt !== null) {
        db.User.update(
          {
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            role: Number(data.role),
            password: password,
            deviceIdNo: data.deviceIdNo,
            isTipAdmin: data.isTipAdmin !== "0",
            address: data.address,
            tcNo: data.tcNo,
            updatedAt: new Date(),
            deleterUserId: null,
            deletedAt: null,
          },
          { where: { id: user.id }, paranoid: false, returning: true }
        )
          .then(() => {
            db.User.findOne({ where: { id: user.id } })
              .then((result) => {
                result.isTipAdmin = result.isTipAdmin ? "1" : "0";

                return res.json({
                  type: true,
                  user: result,
                });
              })
              .catch((e) => {
                return res.json({
                  type: false,
                  data: e.toString(),
                });
              });
          })
          .catch((err) => {
            return res.status(500).json(err);
          });
      } else {
        db.User.create({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          role: Number(data.role),
          password: password,
          deviceIdNo: data.deviceIdNo,
          isTipAdmin: data.isTipAdmin !== "0",
          address: data.address,
          tcNo: data.tcNo,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
          .then((user) => {
            // We create the token
            let token = jwt.sign({ user: user }, authConfig.secret, {
              expiresIn: authConfig.expires,
            });

            return res.json({
              user: user,
              token: token,
            });
          })
          .catch((err) => {
            return res.status(500).json(err);
          });
      }
    }
  );
});

// Login
app.post("/login", async (req, res) => {
  let { tcNo, password } = req.body;
  // Search user
  db.User.findOne({
    where: {
      tcNo,
    },
  })
    .then((user) => {
      if (!user || user.role === 3) {
        return res.status(404).json({ msg: "User with this TC not found" });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          //We create the token
          let token = jwt.sign({ user: user }, authConfig.secret, {
            expiresIn: authConfig.expires,
          });

          return res.json({
            user: user,
            token: token,
          });
        } else {
          // Unauthorized Access
          return res.status(401).json({ msg: "Incorrect password" });
        }
      }
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

// getting tip admins
app.get(
  "/tip/admins",
  auth([UserRolls.Admin, UserRolls.Trainer, UserRolls.CompanyAdmin]),
  async (req, res) => {
    db.User.findAndCountAll({
      order: [["id", "ASC"]],
      where: { isTipAdmin: true },
    })
      .then((result) => {
        return res.json({
          type: true,
          totalCount: result.count,
          entities: result.rows,
        });
      })
      .catch((e) => {
        return res.json({
          type: false,
          data: e.toString(),
        });
      });
  }
);

// getting user monthly info
app.get(
  "/monthly-info/:deviceIdNo",
  auth([UserRolls.Admin, UserRolls.Trainer, UserRolls.CompanyAdmin]),
  async (req, res) => {
    const { deviceIdNo } = req.params;
    db.Mir.findAndCountAll({
      order: [["id", "ASC"]],
      where: { CihazKimlikNo: deviceIdNo, BagajSayisi: { [Op.ne]: "0" } },
    })
      .then((result) => {
        return res.json({
          type: true,
          totalCount: result.count,
          entities: result.rows,
        });
      })
      .catch((e) => {
        return res.json({
          type: false,
          data: e.toString(),
        });
      });
  }
);

app.get(
  "/invidual-info/:deviceIdNo",
  auth([UserRolls.Admin, UserRolls.Trainer, UserRolls.CompanyAdmin]),
  async (req, res) => {
    const { deviceIdNo } = req.params;
    db.Ir.findAndCountAll({
      order: [["id", "ASC"]],
      where: { CihazKimlikNo: deviceIdNo },
    })
      .then((result) => {
        return res.json({
          type: true,
          totalCount: result.count,
          entities: result.rows,
        });
      })
      .catch((e) => {
        return res.json({
          type: false,
          data: e.toString(),
        });
      });
  }
);

app.get(
  "/input-output/:deviceIdNo",
  auth([UserRolls.Admin, UserRolls.Trainer, UserRolls.CompanyAdmin]),
  async (req, res) => {
    const { deviceIdNo } = req.params;
    db.Io.findAndCountAll({
      order: [["id", "ASC"]],
      where: { CihazKimlikNo: deviceIdNo },
    })
      .then((result) => {
        return res.json({
          type: true,
          totalCount: result.count,
          entities: result.rows,
        });
      })
      .catch((e) => {
        return res.json({
          type: false,
          data: e.toString(),
        });
      });
  }
);

module.exports = app;
