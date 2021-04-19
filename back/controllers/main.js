var mongoose = require('mongoose');

module.exports = {
    test: function (req, res, next) {
        res.status(200).json({API :"works"});
    },
    search:  function(req,res, next) {
        let resultat = [];
        let uniqueres = [];
        if(req.body.nom !== undefined){
            var regex = new RegExp(req.body.nom,'i');
        }
        let annonces = mongoose.connection.collection("annonces");
        /*FIXME:Comportement incompréhensible quand on cherche par tag $and ville*/
        annonces.find({$or :[{$or: [
                                    {$and: [{code: req.body.code,nom: regex}]},
                                    {$and: [{tag: req.body.tag,nom: regex}]},
                                    {$and: [{tag: req.body.tag,code: req.body.code,}]},
                                    {$and: [{code: req.body.code}]},
                                    {$and: [{tag: req.body.tag}]},
                                    {$and: [{nom: regex}]}]},
                                    {$and: [{code: req.body.code,nom: regex,tag: req.body.tag}]},
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
