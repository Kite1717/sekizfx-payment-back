const payments = require("./services/payments");

const express = require("express");
const router = express.Router();

// Home Default
router.get("/", (req, res) => res.json({ KITE: "ACTIVE" }));

//uploads
router.use("/files", express.static("uploads"));

/**********SERVICES********/
router.use("/api/payments", payments);

/**************************/

module.exports = router;
