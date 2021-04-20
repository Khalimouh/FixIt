const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { Schema } = mongoose;

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
Clientschema.pre("save",function(){
    const rounds = 10;
    const plaintext = this.password;
    bcrypt.genSaltSync(rounds, "a",function(err, salt) {
        bcrypt.hashSync(this.password, salt, function(err, hash) {
            if(err) console.error(err, "Erreur dans le hachage des mots de passes");
            this.password = hash;
        });
    });
});

module.exports = mongoose.model("clients", Clientschema);
