import React, { useState, useEffect } from "react";
import RouteForm from "./components/RouteForm.jsx";
import MapView from "./components/Mapview.jsx";
import ChatBox from "./components/Chatbox.jsx";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
    });
    return () => socket.off("receiveMessage");
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, padding: "10px" }}>
        <h1>Student Commute Optimizer</h1>
        <RouteForm setUsers={setUsers} />
        <ChatBox socket={socket} chat={chat} />
      </div>
      <div style={{ flex: 2 }}>
        <MapView users={users} />
      </div>
    </div>
  );
}

export default App;
