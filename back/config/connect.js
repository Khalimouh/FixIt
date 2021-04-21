const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const url = "mongodb+srv://" + process.env.DB_USER + ":" +process.env.DB_PASS+"@cluster0.n4mow.mongodb.net/FixIt?retryWrites=true&w=majority"

 mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        keepAlive: 1,
        connectTimeoutMS: 30000
    }, function(err, res) {
        
    }
);
module.export = mongoose;