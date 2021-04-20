const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/login', authController.authenticate, authController.generateTokens);
router.get('/token/refresh',authController.verifyRefreshToken, authController.tokenForUserExist, authController.generateAccessToken);
router.post('/logout',authController.verifyRefreshToken,authController.logout);


module.exports = router;
