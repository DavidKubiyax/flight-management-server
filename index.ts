import { Airplane } from "./types";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { generateUUID } from "./utils";
import { airports } from "./airportList";
import moment from "moment";

const PORT = 6000;
const TIME_FORMAT = "dd/MM/yyyy - HH:mm";

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);


const planes: Airplane[] = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  setInterval(() => {
    publishEntityUpdate(socket);
  }, 300);
});

app.get("/planes", (req, res) => {
  res.json({ planes });
});

app.get("/planes/:id", (req, res) => {
  const plane = planes.find((p) => p.id === req.params.id);
  res.json(plane);
});

server.listen(PORT, () => {
  console.log("server listening on port", PORT);
  for (let i = 0; i < 50; i++) {
    const randomAP1 = Math.floor(Math.random() * 50);
    const randomAP2 = Math.floor(Math.random() * 50);
    planes.push({
      id: generateUUID(),
      status: "hangar",
      takeoffTime: "01/02/2022 - 12:35",
      landingTime: "02/02/2022 - 14:30",
      takeoffAirport: airports[randomAP1],
      landingAirport: airports[randomAP2],
    });
  }
});

function publishEntityUpdate(socket: Socket) {
  const randomIndex = Math.floor(Math.random() * planes.length);
  const randomPlane = planes[randomIndex];
  const actionType = Math.floor(Math.random() * 3);
  switch(actionType) {
    case 0: // status update
      const malfunctionChance = Math.random();
      randomPlane.status = malfunctionChance > 0.9? "malfunction" : "flight";
      break;
    case 1: // time delay
      const delayByMin = Math.floor(Math.random() * 120);
      randomPlane.takeoffTime = moment(randomPlane.takeoffTime, TIME_FORMAT).add(delayByMin, "minutes").format(TIME_FORMAT);
      randomPlane.landingTime = moment(randomPlane.landingTime, TIME_FORMAT).add(delayByMin, "minutes").format(TIME_FORMAT);
      break;
    case 2: // destination update
      const newDestination = airports[Math.floor(Math.random() * 50)];
      randomPlane.landingAirport = newDestination;
      break;
  }
  socket.emit("plane-update", randomPlane);
}