const mongoose = require('mongoose');
const Annonces = require("../models/annonce")
const Users = require("../models/user")
//const jwtdecode = require("jwt-decode")


module.exports = {
    test: function (req, res, next) {
        res.status(200).json({API :"works"});
    },
    
    //Recherche par mot clé des annonces
    search: function(req,res, next) {
        let resultat = [];
        let uniqueres = [];
        if(req.body.metier){
            var regex = new RegExp(req.body.metier,'i');
        }
        let annonces = mongoose.connection.collection("annonces");
        console.log(req.body)
        annonces.find( {tag: req.body.metier}
            , async function(err, curr){
                if(err) console.error(err);
                while (await curr.hasNext()){
                    let tmp = await curr.next();
                    if(tmp.tarifmin <= req.body.prix && tmp.code == req.body.code)
                        resultat.push(tmp);
                }
                console.log(resultat);
                res.status(200).json(resultat);
            });

    },
    //Dépot d'annonces
    submit: function(req,res){
        //console.log(req.headers);
        Annonces.countDocuments({}, async function(err,nb){
            if(err) console.error(err, "Erreur dans le comptage des documents de la collection artisant")
            else{
                let obj = req.body;
                obj.Annonceid = nb;
                obj.user = mongoose.Types.ObjectId(req.user_id);
                obj.photo = req.body.photo;
                today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; 
                var yyyy = today.getFullYear();
                obj.date = dd+'/'+mm+'/'+yyyy;
                obj.avis = [{idclient: 0, noteservice: 0, notetemps: 0, NoteCom: 0,desc:0, date: obj.date}];
                obj.dispo = true;
                console.log(obj)
                Annonces.create(obj, function(err, ann){
                    if(err) console.error(err, "Erreur dans la création de l'annonce")
                    else{
                        res.status(200)
                    }
                })
            }});

    }


};
