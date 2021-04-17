const Client = require("../models/user");
const mongoose = require("mongoose");


module.exports = {
    create: function(req, res, next){
       Client.create(req.body, function(err, client){
           //Gére les erreurs
           if(err) console.error(err, "Erreur dans la création du client dans mongoDB");
           else{
               //retourne le client nouvellement crée avec un code de retour 200(succes)
               res.status(200).json(client);
           }
       });
    }
}