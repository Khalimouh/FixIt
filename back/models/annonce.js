const mongoose = require("mongoose")
const {Schema} = mongoose;

const Annonceschema = new Schema({
    Annonceid: Number,
    nom: String,
    description: String,
    tarifmin: Number,
    tarifmax: Number,
    artisantid: Number,
    avis: [{idclient: Number, noteservice: Number, notetemps: Number, NoteCom: Number,desc:String, date: Date}],
    tag: String,
    photo: Buffer,
    code: Number
});

module.exports = mongoose.model("annonces", Annonceschema)