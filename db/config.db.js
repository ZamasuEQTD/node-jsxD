const mongoose = require("mongoose")


const DBconnection = async ()=>{
    const user = "FrancoGabriel"
    const password = "pk1jySqtqMurh8SM"
    const DBname = "Puesto"
    const uri = `mongodb+srv://FrancoGabriel:${password}@cluster0.uveof.mongodb.net/${DBname}?retryWrites=true&w=majority`
    try{
        await mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    console.log("base Cargada okkk");
    }
    catch(error){
        console.log("acaa");
        console.log(error);
        throw new Error("terrible")
    }
}



module.exports = {
    DBconnection
}