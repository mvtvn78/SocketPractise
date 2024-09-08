var express = require("express")
var app = express();
app.use(express.static("public"))
app.set("view engine","ejs")
app.set("views","./views")
var server = require("http").Server(app);
var io = require("socket.io")(server)
server.listen(3000)
io.on("connection",(socket)=>{
    console.log("There person connect "+ socket.id);
    
    socket.on("make-room",(data)=>{
        socket.join(data);
        socket.roomCurr = data;
        var mangRooms=[]
        for (const x of socket.adapter.rooms) {
            mangRooms.push(x);
          }
        io.sockets.emit("server-send-rooms",mangRooms)
        socket.emit("server-send-room-socket",socket.roomCurr);
    })
    socket.on("user-chat",(data)=>{
        io.sockets.in(socket.roomCurr).emit("server-chat",data)
    })
    socket.on("disconnect",()=>{
        console.log(socket.id + " Disconnect !!")
    })
})
app.get("/",(req,res)=>{
    res.render("trangchu")
})