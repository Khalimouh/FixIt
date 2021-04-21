const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');


/* POST Initie la connexion en envoyant les info  puis génére le token*/
router.post('/login', authController.authenticate, authController.generateTokens);
/* GET Vérifie si le token doit être rafraichi et renvoie le nouveau si besoin est */
router.get('/token/refresh',authController.verifyRefreshToken, authController.tokenForUserExist, authController.generateAccessToken);
/* POST Fini la session */
router.post('/logout',authController.verifyRefreshToken,authController.logout);



module.exports = router;
