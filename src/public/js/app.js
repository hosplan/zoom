// const socket = new WebSocket(`ws://${window.location.host}`);
// const messageList = document.querySelector("ul");
// const nickForm = document.querySelector("#nick");
// const messageForm = document.querySelector("#message");

// function makeMessage(type, payload){
//     const msg = {type, payload};
//     //object 를 string 형태로 변환시켜 back-end 쪽으로 보낸다.
//     return JSON.stringify(msg);
// }

// function handleOpen(){
//     console.log("Connected to Server");
// }

// socket.addEventListener("open", handleOpen);

// socket.addEventListener("message", (message) => {
//     //console.log("New message: ", message.data);
//     const li = document.createElement("li");
//     li.innerText = message.data;
//     messageList.append(li);
// });

// socket.addEventListener("close", () => {
//     console.log("DisConnected from Server")
// });

// // setTimeout(() => {
// //     socket.send("hello from the browser");
// // }, 10000)


// function handleSubmit(event){
//     event.preventDefault();
//     const input = messageForm.querySelector("input");
//     socket.send(makeMessage("new_message", input.value));
//     input.value = "";
// }

// function handleNickSubmit(event){
//     event.preventDefault();
//     const input = nickForm.querySelector("input");
//     socket.send(makeMessage("nickname",input.value));
//     input.value = "";
// }

// messageForm.addEventListener("submit", handleSubmit);
// nickForm.addEventListener("submit", handleNickSubmit);

//io function은 알아서 socket.io를 실행하고 있는 서버를 찾는다.
const socket = io();

const welcom = document.getElementById("welcome");
const form = welcom.querySelector("form");

function backendDone(msg){
    console.log(`The backend says: `, msg);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    //1. 어떤 event든지 전송이 가능하다.
    //2. Javascript object를 전송할 수 있다.
    //ws 는 object를 string 형태로 바꿔주어야 했었다.
    //front-end 에서 실행할 function 같은경우는 항상 맨 마지막에 넣어준다.
    socket.emit("enter_room", input.value, backendDone);
    input.value="";
}
form.addEventListener("submit", handleRoomSubmit);