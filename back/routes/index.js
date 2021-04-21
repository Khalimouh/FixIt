var express = require('express');
var router = express.Router();

const authController = require('../controllers/auth');
const main = require("../controllers/main");
const client = require("../controllers/clientController");

/* GET un utiliateur par id*/
router.get('/user', authController.verifyAccessToken, client.getUser);
/* GET home page. */
router.get('/',main.test);
/* POST envoie les informations de création de compte pour l'inscription*/
router.post('/signup',authController.emailExists, client.create);
/* POST renvoie les resultats de la recherche par mots clé*/
router.post('/search', main.search);

module.exports = router;
