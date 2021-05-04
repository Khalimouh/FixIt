const mongoose = require("mongoose")
const {Schema} = mongoose;

const Annonceschema = new Schema({
    AnnonceID: Number,
    nom: String,
    description: String,
    tarifmin: Number,
    tarifmax: Number,
    artisantid: Number,
    avis: [{idclient: Number, noteservice: Number, notetemps: Number, NoteCom: Number,desc:String, date: Date}],
    tags: String,
    photo:{
        data: Buffer,
        info: String
    },
    code: Number
});

module.exports = mongoose.model("annonces", Annonceschema)