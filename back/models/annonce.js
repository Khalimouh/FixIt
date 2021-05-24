const mongoose = require("mongoose")
const {Schema} = mongoose;

const Annonceschema = new Schema({
    Annonceid: Number,
    nom: String,
    description: String,
    tarifmin: Number,
    artisantid: Number,
    avis: [{idclient: Number, noteservice: Number, notetemps: Number, NoteCom: Number,desc:String, date: String}],
    tag: String,
    photo: String,
    code: Number,
    date: String,
    dateAdd: Date,
    dispo: Boolean,
    user: mongoose.Schema.ObjectId
});

module.exports = mongoose.model("annonces", Annonceschema)
