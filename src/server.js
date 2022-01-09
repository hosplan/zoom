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

wsServer.on("connection", socket => {
    //enter_room이라는 이벤트.
    socket.on("enter_room", (roomName, done) => {
        console.log(roomName);
        setTimeout(() =>{
            //done() function을 실행할때에
            //이 코드를 backend에서 실행하는것이 아니다.
            //frontend에서 실행한다.
            //즉 back-end 에서 front-end 코드를 실행시킨다.
            done("hello from back-end");
        }, 15000);
    });
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
