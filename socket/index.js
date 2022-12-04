const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (newUser) => {
    if (!activeUsers.some((user) => user.userId === newUser)) {
      activeUsers.push({ userId: newUser, socketId: socket.id});
    }
    console.log("connected users",activeUsers)
    io.emit("get-users",activeUsers)
  });

  socket.on("send-message",(data)=>{
    const {recieverId} = data;
    const user = activeUsers.find((user)=>user.userId === recieverId)
    console.log("sending from socket to :" + recieverId)
    console.log(data)
    if(user){
      io.to(user.socketId).emit("receive-message",data)
    }
  })

  socket.on("disconnect",()=>{
    activeUsers = activeUsers.filter((user)=>user.socketId !== socket.id)
    console.log("user disconnected",activeUsers)
    io.emit("get-user",activeUsers)
  })
});
