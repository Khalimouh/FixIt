var express = require('express');
var router = express.Router();

const authController = require('../controllers/auth');
const main = require("../controllers/main");
const client = require("../controllers/clientController");

/* GET home page. */
router.get('/user', authController.verifyAccessToken, client.getUser);
router.get('/',main.test);
router.post('/signup',authController.emailExists, client.create);
router.post('/search', main.search);

module.exports = router;
