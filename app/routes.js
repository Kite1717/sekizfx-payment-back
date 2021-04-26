const user = require("./services/user");

const express = require("express");
const router = express.Router();

// Home Default
router.get("/", (req, res) => res.json({ KITE: "ACTIVE" }));

//uploads
router.use("/files", express.static("uploads"));

/**********SERVICES********/
router.use("/api/user", user);


/**************************/

module.exports = router;
