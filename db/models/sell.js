const mongoose = require("mongoose")
const { itemSchema } = require("./item")

const Schema = mongoose.Schema

const sellSchema = new Schema({
    date:String,
    total: Number,
    cartItems:[itemSchema]
})

const Sell = mongoose.model("Sell",sellSchema)

module.exports = Sell