const Client = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

module.exports = {
    //Insére l'utilisateur dans la collection User puis le renvoie
    create: function(req, res, next){
        console.log(req.body)
        req.body.photo = "default_profile.jpg"
       Client.create(req.body, function(err, client){
           //Gére les erreurs
           if(err) console.error(err, "Erreur dans la création du client dans mongoDB");
           else{
               //retourne le client nouvellement crée avec un code de retour 200(succes)
               res.status(200).json(client);
           }
       });
    },
    //Récupére un utilisateur en fonction de son id
    getUser: function(req, res, next){
        Client.findOne({_id: mongoose.Types.ObjectId(req.user_id)}, function (err, user) {
            if(err) {
                console.log(err);
                res.status(400).json({error:"user not found"});
            }else{
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
