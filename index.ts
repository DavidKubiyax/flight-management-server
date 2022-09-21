import { Airplane } from "./types";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { generateUUID } from "./utils";
import { airports } from "./airportList";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

const planes: Airplane[] = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  setInterval(() => {
    const randomIndex = Math.random() * planes.length;
    // TODO update publish entity
  }, 300);
});

const port = 6000;
server.listen(port, () => {
  console.log("server listening on port", port);
  for (let i = 0; i < 50; i++) {
    const randomAP1 = Math.floor(Math.random() * 50);
    const randomAP2 = Math.floor(Math.random() * 50);
    planes.push({
      id: generateUUID(),
      status: "hangar",
      takeoffTime: "21-09-2022 23:00",
      landingTime: "22-09-2022 01:00",
      takeoffAirport: airports[randomAP1],
      landingAirport: airports[randomAP2],
    });
  }
});

app.get("/planes", (req, res) => {
  res.json({ planes });
});

app.get("/planes/:id", (req, res) => {
  const plane = planes.find((p) => p.id === req.params.id);
  res.json(plane);
});
