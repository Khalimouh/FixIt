const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


module.exports = {
    authenticate: function(req, res, next) {
        userModel.findOne({login: { $eq: req.body.login } }, function(err, user){
            if (err) {
                console.log(err);
                res.status(401).json({error:"authentication error 1"});
            } else {
                if(user) {
                        // if(bcrypt.compareSync(req.body.password, user.password)){
                        if(req.body.password === user.password){
                            req.user_id = user._id;
                            next();
                        }else {
                            res.status(401).json({error:"authentication error 2"});
                        }
                }else{
                    res.status(401).json({error:"authentication error 3"});
                }
            }
        });
    },

    generateTokens: function (req, res, next) {
        const accessToken = jwt.sign({user_id: req.user_id}, process.env.JWT_ACCESS_KEY, { expiresIn: process.env.ACCESS_LIFE });
        const refreshToken = jwt.sign({user_id: req.user_id}, process.env.JWT_REFRESH_KEY, { expiresIn: process.env.REFRESH_LIFE });
        userModel.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.user_id)},{$push:{refreshTokens: refreshToken}},function (err, user) {
            if (err) {
                console.log(err);
                res.status(401).json({error:"generate tokens"});
            }else
                res.status(200).json({accessToken:accessToken, refreshToken:refreshToken});
        });
    },

    emailExists: function(req, res, next){
        userModel.findOne({ login: { $eq : req.body.login} }, function (err, user) {
            if (err){
                console.log(err);
                res.status(401).json({error:"find user error"});
            }else {
                if (user){
                    res.status(401).json({error:"email already taken"});
                }else {
                    next();
                }
            }
        });
    },

    generateAccessToken: function (req, res, next) {
        const token = jwt.sign({user_id: req.user_id}, process.env.JWT_ACCESS_KEY, { expiresIn: process.env.ACCESS_LIFE });
        res.status(200).json({accessToken:token});
    },

    verifyRefreshToken: function (req, res, next) {
        let token = req.body.refreshToken;
        if(!token){
            res.status(401).json({error:"token error"});
        } else {
            if (token.startsWith('Bearer ')) {
                // Remove Bearer from string
                token = token.slice(7, token.length);
            }
            jwt.verify(token, process.env.JWT_REFRESH_KEY, function (err, decoded) {
                if (err){
                    console.log(err);
                    res.status(401).json({error:"verification token"});
                }
                else
                {
                    req.user_id = decoded.user_id;
                    next();
                }
            });
        }
    },

    verifyAccessToken: function (req, res, next) {
        console.log(req.headers['authorization']);

        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if(!token){
            res.status(401).json({error:"verification token"});
        } else {
            if (token.startsWith('Bearer ')) {
                // Remove Bearer from string
                token = token.slice(7, token.length);
            }
            jwt.verify(token, process.env.JWT_ACCESS_KEY, function (err, decoded) {
                if (err){
                    console.log(err)
                    res.status(401).json({error:"verification token"});
                }
                else
                {
                    req.user_id = decoded.user_id;
                    next();
                }
            });
        }
    },

    tokenForUserExist:function(req, res, next){
        userModel.findOne({_id: req.user_id, refreshTokens: req.body.refreshToken}, function (err, user) {
            if(err){
                console.log(err);
                res.status(401).json({error:"verification token"});
            }else {
                if(user){
                    next();
                }else{
                    res.status(401).json({error:"verification token"});
                }
            }
        });
    },

    logout:function (req, res, next) {
        userModel.findOneAndUpdate({_id: req.user_id}, {$pull: {refreshTokens: req.body.refreshToken}}, function (err, user) {
            if(err){
                res.status(401).json({error:"disconnection error"});
            }else{
                res.status(200).json({msg: "disconnected"})
            }
        });
    },

};
