const Annonces = require("../models/annonce");
const User = require("../models/user");
const mongoose = require("mongoose")

module.exports = {
    get: function(req,res){
        console.log(req.body)
        Annonces.find({user: req.user_id},null,{sort:{dateAdd: -1 }}, function(err, ann){
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
    },
    //chercher une annonce par son Id
    getAnnonceById: function(req,res){
        console.log(req.body)
        Annonces.findOne({Annonceid : req.body._id}, function(err, AnnDet){
            if(err){
                console.log(err);
            }
            else{
                console.log(AnnDet)
                User.find({_id: AnnDet.user}, function(err, fullres){
                    if(err){
                        console.log(err);
                    }else{
                        console.log(fullres)
                        res.status(200).json({ainfo: AnnDet, uinfo: fullres})
                    }
                })


            }
        });
    }
}
