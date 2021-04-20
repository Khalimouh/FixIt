var mongoose = require('mongoose');

module.exports = {
    test: function (req, res, next) {
        res.status(200).json({API :"works"});
    },
    search:  function(req,res, next) {
        let resultat = [];
        let uniqueres = [];
        if(req.body.metier){
            var regex = new RegExp(req.body.metier,'i');
        }
        let annonces = mongoose.connection.collection("annonces");
        let artisants = mongoose.connection.collection("artisants");

        annonces.find( { $or:[{code: req.body.code}, {tarifmin: {$lt: req.body.prix} }, {tag: req.body.metier}
                ]}
            , async function(err, curr){
                if(err) console.error(err);
                while (await curr.hasNext()){
                    resultat.push(await curr.next());
                }
                //remove duplicates
                resultat.forEach((ann) => {
                    if(!uniqueres.includes(ann)){
                        uniqueres.push(ann);
                    }
                })
                res.status(200).json(uniqueres);
            });

    }
};
