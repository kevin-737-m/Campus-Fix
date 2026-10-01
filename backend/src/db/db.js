const mongoose = require('mongoose');
require("dotenv").config();

const connectdb = async ()=>{
    try{
        await mongoose.connect(process.env.DB);
        console.log("DataBase Connected Sucessufully");
    }
    catch(err){
        console.log("DataBase not Connected ",err);
        process.exit(1);
    }
}

module.exports = connectdb;