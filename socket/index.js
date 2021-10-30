import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});
let onlineUser = [];

const addNewUser = (username, socketId) => {
  if (!onlineUser.some((user) => user.username === username)) {
    onlineUser.push({ username, socketId });
  }
};
const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUser.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
    console.log("onlineUser", onlineUser);
  });

  socket.on("sendNotification", ({ senderName, reciverName, type }) => {
    const reciver = getUser(reciverName);
    console.log("reciver:", reciver, senderName, reciverName);
    io.to(reciver.socketId).emit("getNotification", { senderName, type });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(5000);
