var express = require('express');
var router = express.Router();

const authController = require('../controllers/auth');
const main = require("../controllers/main");
const client = require("../controllers/clientController");
const path = require('path');
const multer = require('multer');

//Gestion des images
//Enregistrer une image
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

const upload = multer({storage:storage,
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            console.log('upload image error')
        }
        callback(null, true)
    }
    ,limits:{fileSize:1024*1024}}); // 10MO size

/*Mise à jour profil sauf mot de passe*/
router.put('/user', authController.verifyAccessToken, upload.single('photo'), client.updateUser);
/* Metre à jour mot de passe*/
router.put('/user/password',authController.verifyAccessToken, client.verifyOldPassword, client.updatePassword);
/* GET un utiliateur par id*/
router.get('/user', authController.verifyAccessToken, client.getUser);
/* GET home page. */
router.get('/',main.test);
/* POST envoie les informations de création de compte pour l'inscription*/
router.post('/signup',authController.emailExists, client.create);
/* POST renvoie les resultats de la recherche par mots clé*/
router.post('/search', main.search);
/* POST cree une annonce a partir des données du formulaire */
router.post('/submit',upload.array('photo',3), main.submit)

module.exports = router;