var express = require('express');
var router = express.Router();

var pool = require("../db/pool");

/* GET users listing. */
router.get("/", function (req, res, next) {
  pool.query("SELECT * FROM users", function (error, result) {
    if (error) {
      throw error;
    }
    res.status(200).json({
      data: result.rows,
    });
  });
});

module.exports = router;
