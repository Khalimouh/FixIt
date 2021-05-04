const mongoose = require('mongoose');
const Annonces = require("../models/annonce")

module.exports = {
    test: function (req, res, next) {
        res.status(200).json({API :"works"});
    },

    //Recherche par mot clé des annonces
    search:  function(req,res, next) {
        let resultat = [];
        let uniqueres = [];
        if(req.body.metier){
            var regex = new RegExp(req.body.metier,'i');
        }
        let annonces = mongoose.connection.collection("annonces");

        annonces.find( { $or:[{code: req.body.code}, {tarifmin: {$lt: req.body.prix} }, {tag: regex}]}
            , async function(err, curr){
                if(err) console.error(err);
                while (await curr.hasNext()){
                    resultat.push(await curr.next());
                }
                //Suppression des doublons
                resultat.forEach((ann) => {
                    if(!uniqueres.includes(ann)){
                        uniqueres.push(ann);
                    }
                })
                //Code 200 = OK et retourne les résultats
                res.status(200).json(uniqueres);
            });

    },
    //Dépot d'annonces
    submit: function(req,res){
        console.log(req.body.id)
        Annonces.create(req.body, function(err, ann){
            if(err) console.error(err, "Erreur dans la création de l'annonce")
            else{
                res.status(200)
            }
        })
        res.status(200).json({res: "OK"})
    }


};
