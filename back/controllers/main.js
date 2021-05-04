var mongoose = require('mongoose');

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
        annonces.find( {tag: req.body.tag}
            , async function(err, curr){
                if(err) console.error(err);
                while (await curr.hasNext()){
                    resultat.push(await curr.next());
                }
                //console.log(req);

                resultat.forEach((ann) => {
                    if(req.body.code === ' '){ //  && req.body.tarifmax === null
                        uniqueres.push(ann);
                    }
                    if(ann.code === req.body.code && ann.tarifmax <= req.body.tarifmax) { //
                        console.log("Filtrage par code")
                        uniqueres.push(ann);
                    }
                })

                console.log(uniqueres);
                res.status(200).json(uniqueres);
            });
    }
}