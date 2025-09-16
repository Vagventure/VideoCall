import express from "express"
import { fileURLToPath } from "url"
import { createServer } from "http"
import { dirname, join } from "path"
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

io.on("connection", (socket) => {
  console.log(`Someone has joined with the id: ${socket.id}`)
  socket.on("join user", username => {
    console.log(`${username} has joined the session`)
    allusers[username] = { username, id: socket.id }
    io.emit("joined", allusers);
  })

  socket.on("join room", ({ username, room }) => {
    console.log(`${username} has joined the room: `, room)
    if (!allusers[room]) {
      allusers[room] = {};
    }
    allusers[room][username] = { username, id: socket.id };
    io.emit("joined room", allusers);
  })

  socket.on("offer", ({ from, to, offer }) => {
    console.log({ from, to, offer })
    io.to(allusers[to].id).emit("offer", { from, to, offer })
  })
  socket.on("answer", ({ from, to, answer }) => {
    console.log({ from, to, answer })
    io.to(allusers[from].id).emit("answer", { from, to, answer })
  })
  socket.on("icecandidate", candidate => {
    socket.broadcast.emit("icecandidate", candidate)
  })
  socket.on("end-call", ({ from, to }) => {
    io.to(allusers[to].id).emit("end-call", ({ from, to }))
  })
  socket.on("call-ended", caller => {
    const [from, to] = caller;
    io.to(allusers[to].id).emit("call-ended", caller)
    io.to(allusers[from].id).emit("call-ended", caller)
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
