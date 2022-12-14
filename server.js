const bodyParser = require("body-parser")
const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const cors = require("cors")
const app = express()
// uuid
const { v1: uuidv1,v4: uuidv4} = require('uuid')


const {DBconnection} = require("./db/config.db.js")
const Item = require("./db/models/item")
const Sell = require("./db/models/sell.js")
app.use(bodyParser.json())
app.use(cors())

const server = http.createServer(app)
const io = socketio(server, {
    cors:{
        origin: "*"
    }
})

const getId = ()=>{
    return uuidv4()
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
  }




DBconnection().then(()=>{
    io.on("connection", socket =>{
        const emitItems = async()=>{
            console.log("itemss")
            const items = await Item.find().lean()
            io.emit("server:loadItems",items)
        }
        const emitSells = async()=>{
            console.log("me han llamado")
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
            let  a = await Item.findOne({itemId:id})
            await Item.findOneAndUpdate({itemId:id},item)
            emitItems()
        })
        socket.on("client:newSell",async(data)=>{
            const tiempo = new Date()
            await new Sell({...data,sellId:getId(),date:formatDate(tiempo), hora: `${tiempo.getHours()}:${tiempo.getMinutes()}`}).save()
            emitSells()
        })
        
        socket.on("disconnect",()=>{
        })
    })
})

const PORT = process.env.PORT

server.listen(PORT,()=>{
    console.log(PORT)
})