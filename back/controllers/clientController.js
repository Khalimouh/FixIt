const Client = require("../models/user");
const mongoose = require("mongoose");


module.exports = {
    //Insére l'utilisateur dans la collection User puis le renvoie
    create: function(req, res, next){
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
}
