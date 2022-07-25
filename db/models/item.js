const mongoose = require("mongoose")

const Schema = mongoose.Schema

const itemSchema = new Schema({
    itemName: String,
    price: Number,
    itemId:String,
    stock:Number
})

const Item = mongoose.model("Item",itemSchema)

module.exports = Item