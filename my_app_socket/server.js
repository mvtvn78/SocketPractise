var express = require("express")
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server,
    {
        cors: {
            origin: "http://localhost:5000"
          }
    }
)
server.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});
const arr=[]
io.on("connect",(socket)=>{
    console.log("There person connect "+ socket.id);
    socket.on("disconnect",()=>{
        console.log(socket.id + " Disconnect !!")
    })
    socket.on("client_request",(data)=>{
        console.log(socket.id + "Send msg to admin " + data)
        console.log(socket.roomCurrent);
        if(socket.roomCurrent != null)
        {
            io.sockets.in(socket.roomCurrent).emit("client_send",data)
            arr.push(
                {
                    msg:data,
                    room: socket.roomCurrent,
                    id : 0
                }
            )
        }
    })
    socket.on("admin_request",(data)=>{
        console.log(socket.id + "Send msg to client " + data)
        console.log(socket.roomCurrent);
        if(socket.roomCurrent != null)
        {
            io.sockets.in(socket.roomCurrent).emit("admin_send",data)
            arr.push(
                {
                    msg:data,
                    room: socket.roomCurrent,
                    id : 1
                }
            )
        }
    })
    socket.on("join_room",(roomName)=>{
        
        socket.join(roomName)
        socket.roomCurrent = roomName
        //Send roomCurrent 
        socket.emit("server_send_room",socket.roomCurrent)
        //Send old msg
        socket.emit("server_send_old_msg",arr.filter((value)=> value.room == roomName))
        //Check room
        const rooms = []
        for(const x of socket.adapter.rooms)
        {
            rooms.push(x)
        }
        console.log(rooms);
    })
    socket.on("leave_room",(roomName)=>{
        socket.leave(roomName)
        socket.roomCurrent = null
        console.log(socket.id +" leave room " + roomName);
    })
    
})