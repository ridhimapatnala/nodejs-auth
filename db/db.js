const MONGO_URI=process.env.MONGODB_URI

const mongoose = require('mongoose')

const connectToDB = async () =>{
    try{
        await mongoose.connect(MONGO_URI)
        console.log('mongodb connection successful')
    }catch(e){
        console.log("mongodb connection failed:", e)
        process.exit(1)
    }
}

module.exports=connectToDB