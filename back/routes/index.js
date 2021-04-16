var express = require('express');
var router = express.Router();
const main = require("../controllers/main");

/* GET home page. */
router.get('/',main.test );

module.exports = router;
