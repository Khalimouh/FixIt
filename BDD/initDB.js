//Création du client
//var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const faker = require("faker");
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;
var url = "mongodb+srv://groupe8:groupe8@cluster0.n4mow.mongodb.net/FixIt?retryWrites=true&w=majority"
faker.locale = "fr";
mongoose.Promise = global.Promise;


var metiers = [
    "peintre",
    "carreleur",
    "chauffagiste",
    "couvreur",
    "maçon",
    "plombier",
    "céramique",
    "cordonnier",
    "ébéniste",
    "ferronnier",
    "fleuriste",
    "sculpteur",
    "graveur",
    "prothésiste", 
    "sellier",
    "tapissier",
    "vannier",
    "horloger",
    "lapidaire",
    "diamantaire",
    "sertisseur",
    "céramiste",
    "verrier",
    "shaper",
    "tonnelier"
]


async function main(){
try{
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: false,
        keepAlive: 1, 
        connectTimeoutMS: 30000
    }, function(err, res){
        //console.log(res);
        console.log("Connecté");
        var db = mongoose.connection;
        try{
           dropDB(db).then(creeAnnonce()).then(creeArtisants()).then(creeClients()).then(seedDB());
        }catch(err){
            console.log(err);
        }finally{
            console.log("Successfull ! Disconnecting")
           //mongoose.disconnect();
            //process.exit(1);
        }

    });
}catch(err){
    console.log(err);
}
    
}
async function creeArtisants(){
    const Artisantschema = new Schema({
        id: Number,
        dispo: Boolean,
        login: String,
        password: String,
        nom: String,
        prenom: String,
        adresse: String,
        tel: Number, 
        mail: String,
        score : Number,
        annonce : [{id: Number}],
        photo:{
            data: Buffer,
            info: String
        },
        certificat:{
            data: Buffer,
            info: String
        },
        estenligne: Boolean,
        metier: String,
        experience : Number,
        estverifie: Boolean,  
        identite:{
            data: Buffer,
            info: String
        },
        description: String,
        contracts: [{
            clientid: Number,
            annonceid: Number,
            datedeb: Date,
            datefin: Date,
            prix: Number,
            etat: String,
            lieu: String
        }]       
    });

    Artisantschema.plugin(uniqueValidator);
    //Creation du model
    const Artisant = mongoose.model('artisants', Artisantschema);

    try{ 
        var promise = await Artisant.createCollection();
        console.log("Creation de la collection Artisants");
    }catch(err){
       console.log(err);
   }
};

async function creeAnnonce(){
    const Annonceschema = new Schema({
        AnnonceID: Number,
        nom: String,
        desciption: String,
        tarifmin: Number,
        tarifmax: Number,
        artisantid: Number,
        avis: [{idclient: Number, noteservice: Number, notetemps: Number, NoteCom: Number,desc:String, date: Date}],
        tags: [{tag:String}],
        photo:{
            data: Buffer,
            info: String
        },
        code: Number
    });
    //Creation du model
    const Annonce = mongoose.model('annonces', Annonceschema);
    try{ 
        var promise = await Annonce.createCollection();

        console.log("Creation de la collection Annonces");
    }catch(err){
       console.log(err);
   }
};

async function creeClients(){
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
        description: String
    });

    //Creation du model
    const Client = mongoose.model('clients', Clientschema);
    try{ 
        var promise2 = await Client.createCollection();

        console.log("Creation de la collection Client");
    }catch(err){
       console.log(err);
   }
};

async function seedDB(){
    var db = mongoose.connection;
    try{
       await seedArtisants(db).then(seedAnnonces(db)).then(seedClients(db).finally(function(){
           console.log("database seeded");
        })); 
    }catch(err){
        console.log(err);
    }
}
async function dropDB(db){
    try{
         await db.dropDatabase("testdb");
    }catch(err){
        console.log("Erreur drop db")
    }
}

async function seedArtisants(db){
    let ArtisantCollection = db.collection("artisants");
    let Artisants = [];
    let id, nom, prenom,adresse,tel, email, photo, desc, metier, jobdesc, login,password;
    for (let size = 0; size < 5000; size++) {
        id = size;
        nom = faker.name.lastName();
        prenom = faker.name.firstName();
        adresse = faker.address.zipCode('###')+ "00";
        tel = faker.phone.phoneNumber();
        email = faker.internet.email();
        photo = faker.image.image();
        desc = faker.lorem.sentence();
        metier = metiers[getdrandom(0,metiers.length-1)];
        jobdesc = faker.lorem.sentence();
        login = faker.internet.userName();
        password = faker.internet.password();
        exp = getdrandom(0,10);

        let Art = {
            id, dispo:true,login, password,nom,prenom, adresse, tel,email,avis:{"note":getdrandom(0,5),"avis":faker.lorem.lines},photo:{"data": photo, "info":desc},certificat:{data: photo, indo:desc},
            estverifie:true, metier, exp,estenligne:false, identite:{"data": photo, "info":desc}, jobdesc 
        }

        Artisants.push(Art);
        //console.log(metier);
        //inserer dans la base    
    }
   try{
        await ArtisantCollection.insertMany(Artisants);

        console.log("Remplissage de la collection Artisants");
    }catch(err){
        console.log(err);
    }
}

// Implementation de la table client
async function seedClients(db){
    let ClientCollection = db.collection("clients");
    let Clients = [];
    let id, nom, prenom,adresse,tel, email, photo, identite, desc;
    for (let size = 0; size < 5000; size++) {
         id = size;
         nom = faker.name.lastName();
         prenom = faker.name.firstName();
         adresse = faker.address.city();
         tel = faker.phone.phoneNumber();
         email = faker.internet.email();
         photo = faker.image.image();
         identite = faker.image.business();
         desc = faker.name.jobDescriptor();

        let Client = {
            id,nom,prenom, adresse, tel,email,photo:{"data": photo, "info":desc},identite:{data: photo, indo:desc}, desc
        };
        Clients.push(Client);
        
    }
    try{
        await ClientCollection.insertMany(Clients);
        console.log("Remplissage de la collection Clients");
    }catch(err){
        console.log(err);
    }
}


async function seedAnnonces(db){
    let AnnoncesCollection = db.collection("annonces");
    let annonces = [];
    let Annonceid,nom,desc,tarifmin,tarifmax;
    for (let size = 0; size < 5000; size++) {
        Annonceid = size;
        nom = faker.lorem.sentence();
        desc = faker.lorem.sentence();
        tarifmin = 10;
        tarifmax = 5000;
        let tag = (metiers[getdrandom(0,metiers.length -1)]);
        let annonce = {
            Annonceid,nom,desc,tarifmin,tarifmax,artiantid:getdrandom(0,500), avis: [{"idclient":getdrandom(0,5000),"noteservice":getdrandom(0,5),"notestemps":getdrandom(0,5),"NoteCom":getdrandom(0,5),"desc":faker.lorem.sentences(), "date": faker.date.recent()}], tag,
            photo:{
                "data": faker.internet.avatar(),
                "info": faker.lorem.sentence()
            },
            code : faker.address.zipCode('###')+ "00"
        }
            annonces.push(annonce);

        }
        try{
            await AnnoncesCollection.insertMany(annonces);
            console.log("Remplissage de la collection Annonces");
        }catch(err){
            console.log(err);
        }
    }

function getdrandom(min,max){
    return Math.floor(
        Math.random() * (max-min +1) + min
    );
} 
main();
