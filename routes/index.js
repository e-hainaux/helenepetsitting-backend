var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/date", (req, res) => {
  const date = new Date();
  res.json({ now: date });
});

module.exports = router;
