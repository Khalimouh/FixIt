const Annonces = require("../models/annonce");
const mongoose = require("mongoose")

module.exports = {
    get: function(req,res){
        console.log(req.body)
        Annonces.find({user: req.user_id}, function(err, ann){
            if(err){
                console.log('Error get annonces');
            }
            else{
                res.status(200).json(ann);
            }
        });
    },
    updateDispo: function (req,res){
        console.log(req.body)
        Annonces.findOneAndUpdate({Annonceid: req.body.ida},{dispo: req.body.value}, function(err,rez){
            if(err){
                console.err("Erreur update dispo")
            }else{
                res.status(200);
            }
        });
    }
}