const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config({path:"./config/config.env"});

const connectDatabase = () => {
    mongoose.connect(`${process.env.DB_URI}`).then(
        (data)=>{
            console.log(`Mongodb is connected with the server: ${data.connection.host}`);
        })
}

module.exports = connectDatabase;