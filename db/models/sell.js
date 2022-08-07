const mongoose = require("mongoose")
const { itemSchema } = require("./item")

const Schema = mongoose.Schema

const sellSchema = new Schema({
    hora:String,
    date:String,
    total: Number,
    sellId:String,
    cartItems:String
})

const Sell = mongoose.model("Sell",sellSchema)

module.exports = Sell