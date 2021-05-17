const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const encrypt = require('mongoose-encryption');
const { Schema } = mongoose;
require('dotenv').config();

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
    photo:String,
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

//TODO: Déplacer les clé dans le .env et trouver un moyen d'implémenter un key vault local from scratch
let encKey = process.env.AESK
let signKey = process.env.HMACK

//Chiffrement et signature des données sensibles des champs sensibles
//TODO: Ajouter au fûr et a mesure les cfhamps a chiffrer etou signer
Clientschema.plugin(encrypt, { encryptionKey: encKey, signingKey: signKey , encryptedFields: ['adresse','tel','mail','identité']})

//Création d'un middleware de chiffrement à éxécuter avant l'insertion en base
Clientschema.pre("save",async function(next){
    const SALT_WORK_FACTOR = 10;
    const salt  = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password =  await bcrypt.hash(this.password, salt);
    console.log(this)
    next();
});

module.exports = mongoose.model("clients", Clientschema);


