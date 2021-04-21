const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { Schema } = mongoose;

//Extension de structure de
const Clientschema = new Schema({
    id: Number,
    login: String,
    password: String,
    nom: String,
    prenom: String,
    adresse: String,
    tel: Number,
    mail: String,
    photo:{
        data: Buffer,
        info: String
    },
    identite:{
        data: Buffer,
        info: String
    },
    description: String,
    refreshTokens: [{
        type: String,
        trim: true,
    }]
});

//Création d'un middleware de chiffrement à éxécuter avant l'insertion en base
Clientschema.pre("save",async function(next){
    const SALT_WORK_FACTOR = 10;
    const salt  = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password =  await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("clients", Clientschema);
