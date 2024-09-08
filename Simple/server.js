var express = require("express")
var app = express();
app.use(express.static("public"))
app.set("view engine","ejs")
app.set("views","./views")
var server = require("http").Server(app);
var io = require("socket.io")(server)
server.listen(3000)
var mangUsers=[]
io.on("connection",(socket)=>{
    console.log("There person connect "+ socket.id);
    socket.on("client-send-Username",(data)=>{
        console.log(socket.id+" send data "+ data);
        if(mangUsers.indexOf(data) >=0){
            socket.emit("Server-send-failed");
        }

        else
        {
            mangUsers.push(data)
            socket.Username=data;
            socket.emit("Server-send-success",data);
            io.sockets.emit("Server-send-Users",mangUsers)
        }
    })
    socket.on("client-logout-Username",()=>{
        mangUsers.splice(
            mangUsers.indexOf(socket.Username),1
        )
        socket.broadcast.emit("Server-send-Users",mangUsers)
    })
    socket.on("user-send-msg",(data)=>{
        io.sockets.emit("server-send-msg",{
            username: socket.Username,
            msgText : data
        })
    })
    socket.on("disconnect",()=>{
        console.log(socket.id + " Disconnect !!")
    })
})
app.get("/",(req,res)=>{
    res.render("trangchu")
})