const Client = require("../models/user");
const Token= require("../models/token");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const sgMail = require('@sendgrid/mail')

module.exports = {
    //Insére l'utilisateur dans la collection User puis le renvoie
    create: function(req, res, next){
        console.log(req.body)
        req.body.photo = "default_profile.jpg"
       Client.create(req.body, function(err, client){
           //Gére les erreurs
           if (!err) {
               const token = new Token({ _userId: client._id, token: crypto.randomBytes(16).toString('hex') });
               token.save(function (err) {
                   if (err) {
                       console.log("erreur 2")
                       console.log(err)
                       return res.status(500).send({ msg: err.message }); }
                   // Send the email
                   sgMail.setApiKey(process.env.SENDGRID_API_KEY)
                   const mailOptions = {
                       to: client.login,
                       from: 'haffarm1@hotmail.com',
                       subject: 'Account Verification Token',
                       text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '/confirmation?token=' + token.token + '\n',
                       //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                   };
                   sgMail
                       .send(mailOptions)
                       .then(() => {
                           console.log('Email sent')
                       })
                       .catch((error) => {
                          // console.log("erreur 3")
                           console.error(error)
                       })
               });

           } else {
               console.log("erreur 1")
               console.error(err, "Erreur dans la création du client dans mongoDB");
           }
       });
    },
    //confirmation de l'email
    confirmationPost: function (req, res, next) {
        // Find a matching token
        Token.findOne({ token: req.query.token }, function (err, token) {
            console.log(req.redirect)
            //console.log(token)
           // console.log(err)
            if (!token) {
                console.log("erreur 1")
                return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' }); //token expiré
                }

            // trouver l'utilisateur de ce token récupéré
            console.log(req.body)
            Client.findOne({ _id: token._userId }, function (err, user) {
                if (!user) {
                    console.log("erreur 2")
                    return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                    }
                if (user.isVerified) {
                    console.log("erreur 3")
                    return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });}

                // vérification et enregestrement de l'utilisateur
                user.isVerified = true;
                user.save(function (err) {
                    if (err) {
                        console.log(user.isVerified)
                        console.log("erreur 4")
                        console.log(err)
                        return res.status(500).send({ msg: err.message }); }
                    res.status(200).send("The account has been verified. Please log in.");

                });
            });
        });
    },

    //revoyer le lien de vérification de mail
    resendTokenPost: function (req, res, next) {
        Client.findOne({ _id: req.user_id }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
            if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

            // Create a verification token, save it, and send email
            const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

            // Save the token
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }

                // Send the email
                sgMail.setApiKey(process.env.SENDGRID_API_KEY)
                const mailOptions = {
                    to: user.login,
                    from: 'haffarm1@hotmail.com',
                    subject: 'Account Verification Token',
                    text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '/confirmation?token=' + token.token + '\n',
                    //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                };
                sgMail
                    .send(mailOptions)
                    .then(() => {
                        console.log('Email sent')
                    })
                    .catch((error) => {
                        // console.log("erreur 3")
                        console.error(error)
                    })
            });

        });
    },
    //Récupére un utilisateur en fonction de son id
    getUser: function(req, res, next){
        Client.findOne({_id: mongoose.Types.ObjectId(req.user_id)}, function (err, user) {
            if(err) {
                console.log(err);
                res.status(400).json({error:"user not found"});
            }else{
                console.log(user);
                res.status(200).json(user);
            }
        })
    },

    //Mise à jour de user
    updateUser: function(req, res, next){
        console.log(req.body)
        Client.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.user_id)}, req.body, {new: true}, function (err, user) {
            if(err) {
                console.error(err, "Erreur dans la MAJ du client dans mongoDB");
            }else
                res.status(200).json(user);
        })
    },


    // Vérifier l'ancien mot de passe
    verifyOldPassword: function(req, res, next){
        Client.findOne({_id: req.user_id}, function (err, user) {
            if(err){
                console.log('verifyOldPassword, find user ');
            }
            else {
                if (user) {
                    if (bcrypt.compareSync(req.body.old_password, user.password)) next();
                    else {
                        console.log('verifyOldPassword, failed comparing passwords');
                    }
                }
                else {
                    console.log('verifyOldPassword, user not exist');
                }
            }
        });
    },

    //Mise à jour de mot de passe
    updatePassword: function(req, res, next) {
        Client.findOneAndUpdate({_id: req.user_id}, {password: bcrypt.hashSync(req.body.new_password, 10)}, function (err, user) {
            if(err){
                console.log('updatePassword, find user');
            }
            else {
                if (user) res.status(200).json({message: "Password updated successfully"});
                else {
                    console.log('updatePassword, user not exist');
                }
            }
        });
    },

}
