const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors')

const app = express()
const users = [{}]
const ages = [{}]
const imgURL = [{}]
app.use(cors())
const server = http.createServer(app)

const io = socketIO(server)

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         method: ["GET", "POST"]
//     }
// }
// )

io.on("connect", (socket) => {
    console.log("connected new user")


    socket.on("join", (data) => {
        users[socket.id] = data.user.name
        ages[socket.id] = data.user.age
        imgURL[socket.id] = data.user.url

        // console.log(data.user.name + " joined")
        socket.broadcast.emit("newUserJoin", { name: "joinANDleft", message: `${users[socket.id]} Was Joined` })

        socket.emit("welcome", { name: "joinANDleft", message: `Welcome To The Chat Room ${users[socket.id]}` })

    })
    socket.on("message", ({ message, id }) => {
        // toast.success("New Message")
        io.emit("sendMessage", { name: users[id], message, id, url: imgURL[id] })
    })



    socket.on("disconnected", () => {
        console.log(`user left`)

        socket.broadcast.emit("leave", { name: "joinANDleft", message: `${users[socket.id]} left the chat room` })
    })


})
const port = 4500 || process.env.PORT

server.listen(port, () => {
    console.log("Server is running on the port http://localhost:" + port)
})