var express = require('express');
var router = express.Router();
const main = require("../controllers/main");
const client = require("../controllers/clientController");
/* GET home page. */
router.get('/',main.test);
router.post('/signup',client.create);
module.exports = router;
