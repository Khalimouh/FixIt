var express = require('express');
var router = express.Router();

const authController = require('../controllers/auth');
const main = require("../controllers/main");
const client = require("../controllers/clientController");
const path = require('path');
const annoncesController = require("../controllers/annoncesController")
const multer = require('multer');

//Gestion des images

//paramètre de la fonction de stockage indique l'emplacemnt.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'public/');
    },
    filename: function (req, file, cb) {
        if (file){
            let customName = req.user_id + Date.now() +  path.extname(file.originalname);
            req.body.image = customName;
            cb(null, customName);
        }
    }
});
//Enregistrer une image
const upload = multer({storage:storage,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') { //extention de fichier
            console.log('upload image error')
        }
        callback(null, true)
    }
    ,limits:{fileSize:1024*1024}}); // 10MO size

/* Mise à jour profil sauf mot de passe*/
router.put('/user', authController.verifyAccessToken, upload.single('photo'), client.updateUser);
/* Metre à jour mot de passe*/
router.put('/user/password',authController.verifyAccessToken, client.verifyOldPassword, client.updatePassword);
/* GET un utiliateur par id*/
router.get('/user', authController.verifyAccessToken, client.getUser);
/* GET home page.*/
router.get('/',main.test);
/* POST envoie les informations de création de compte pour l'inscription*/
router.post('/signup',authController.emailExists, client.create);
/* POST confirmation de mail*/
router.get('/confirmation', client.confirmationPost);
/* POST envoyer encore une fois une demande confirmation de mail*/
router.post('/resend', client.resendTokenPost);
/* POST renvoie les resultats de la recherche par mots clé*/
router.post('/search', main.search);
/* POST cree une annonce a partir des données du formulaire*/
router.post('/submit',authController.verifyAccessToken,upload.array('photo',3), main.submit)
/* POST pour la récupération des annonces par utilisateurs*/
router.post('/getAnnonces', authController.verifyAccessToken, annoncesController.get)
/* PUT pour mettre à jour la disponibilité d'une annonce*/
router.put('/annoncesDispo', authController.verifyAccessToken, annoncesController.updateDispo)


module.exports = router;
