import express from "express"
import {fileURLToPath} from "url"
import { createServer } from "http"
import { dirname,join } from "path"
import { Server } from "socket.io"


const app = express()
const server = createServer(app);
const io = new Server(server)
const port = 3000
const allusers = {}

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static("public"))

app.get('/', (req, res) => {
 console.log("Hello");
  res.sendFile(join(__dirname + "/app/index.html"))
})

io.on("connection",(socket)=>{
    console.log(`Someone has joined with the id: ${socket.id}`)
    socket.on("join user", username =>{
        console.log(`${username} has joined the session`)
        allusers[username] = {username,id:socket.id}
        io.emit("joined",allusers);
    })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
