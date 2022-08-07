
const {DBconnection} = require("./db/config.db.js")
const Item = require("./db/models/item")
const Sell = require("./db/models/sell.js")
const socketio = require("socket.io")

const Sockets = (io)=>{
    io.on("connection", socket =>{
        const emitItems = async()=>{
            const items = await Item.find().lean()
            io.emit("server:loadItems",items)
        }
        const emitSells = async()=>{
            const sells = await Sell.find().lean()
            io.emit("server:loadSells",sells)
        }
        emitSells()
        emitItems()
        socket.on("client:newItem",async({name,price,stock})=>{
            await new Item({itemName:name,price,itemId:getId(),stock}).save()
            emitItems()
        })
        
        socket.on("client:delItem",async (item)=>{  
            let id = item.itemId
            await Item.findOneAndDelete({itemId:id})
            emitItems()
        })
        socket.on("client:updateItem",async(item)=>{
            let id = item.itemId
            console.log(id)
            let  a = await Item.findOne({itemId:id})
            console.log(a)
            await Item.findOneAndUpdate({itemId:id},item)
            emitItems()
        })
        socket.on("client:newSell",async(data)=>{
            console.log({data,sellId:getId(),date:formatDate(new Date())})
            await new Sell({data,sellId:getId(),date:formatDate(new Date())}).save()
        })

        socket.on("disconnect",()=>{
        })
    })
}

module.exports = Sockets()