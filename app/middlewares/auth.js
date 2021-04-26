const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");

const auth = (roles = []) => (req, res, next) => {
  //Single Permission
  if (typeof roles === "number") {
    roles = [roles];
  }

  // Check that the token exists
  if (!req.headers.authorization) {
    res.status(401).json({ msg: "Unauthorized access" });
  } else {
    let token = req.headers.authorization.split(" ")[1];

    // Check the validity of this token
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        res
          .status(500)
          .json({ msg: "There was a problem decoding the token", err });
      } else {
        req.user = decoded.user;
        //Roll Based
        if (roles.length && !roles.includes(Number(req.user.role)))
          res.status(401).json({ msg: "Access Denied" });
        else next();
      }
    });
  }
};

module.exports = auth;
