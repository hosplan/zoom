import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
//public 폴더를 유저에게 공개한다.

app.use("/public", express.static(__dirname + "/public"));
//route 설정
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http:localhost:3000`);
//app.listen(3000, handleListen);

//http 서버 위에 WebSocket 서버를 만든다.
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

//connection이 이루어지면 function이 실행된다.
wss.on("connection", (socket) => {
    console.log("Connected to Browser");
    socket.on("close", () => console.log("Disconnected from Browser"));
    socket.on("message", message => {
        console.log(message.toString('utf8'));
    });
    socket.send("hello!!!!!");
});
server.listen(3000, handleListen); 