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

DBconnection().then(()=>{
    io.on("connection", socket =>{
        console.log("conectado")
        const emitItems = async()=>{
            const items = await Item.find().lean()
            io.emit("server:loadItems",items)
        }
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
        socket.on("disconnect",()=>{
            console.log("desconectadoooooown")
        })
        
    })
})

const PORT = process.env.PORT

server.listen(PORT ,()=>{
    console.log("running")
})