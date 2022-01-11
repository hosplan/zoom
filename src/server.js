import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
//public 폴더를 유저에게 공개한다.

app.use("/public", express.static(__dirname + "/public"));
//route 설정
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));


//app.listen(3000, handleListen);

//http 서버 위에 WebSocket 서버를 만든다.
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function publicRooms(){
    const {
        sockets: {
            adapter:{sids, rooms},
        },
    } = wsServer;
    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = wsServer.sockets.adapter.rooms;
    const publicRooms = [];
    rooms.forEach((_,key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key)
        } 
    });
    return publicRooms;
}

wsServer.on("connection", socket => {
    socket["nickname"] = "Anon";
    socket.onAny((event)=>{
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event:${event}`);        
    });
    //enter_room이라는 이벤트.
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        //done()은 app.js 의 showRoom()을 실행시킨다.
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
    });
    socket.on("new_message", (msg, room, done) => {
        //app.js 의 socket.on("new_message")로 간다.
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname))
});

//const wss = new WebSocket.Server({server});

function onSocketClose(){
    console.log("Disconnected from Browser");
}

// const sockets = [];

// //connection이 이루어지면 function이 실행된다.
// wss.on("connection", (socket) => {
//     //firefox 브라우저로 접속하면 sockets 에 해당 브라우저의 정보를 담는다.
//     //chrome 브라우저로 접속하면 sockets에 해당 브라우저의 정보를 담는다.
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Connected to Browser");
//     socket.on("close", onSocketClose);
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch(message.type){
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
//                 break;
//             case "nickname" :
//                 socket["nickname"] = message.payload;
//                 break;
//         }
//     });
// });


const handleListen = () => console.log(`Listening on http:localhost:3000`);
httpServer.listen(3000, handleListen); 
