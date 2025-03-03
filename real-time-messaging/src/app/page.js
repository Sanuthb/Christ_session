"use client"; // Required for client-side WebSockets
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Home() {
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);

      // Remove message after 5 seconds
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg !== message));
      }, 5000);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = (emoji) => {
    if (name.trim() === "") return;

    const message = { name, emoji };
    socket.emit("sendMessage", message);
    setName("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 relative">
      {/* Floating Messages */}
      <div className="absolute bottom-4 right-4 w-64 max-h-[50vh] overflow-hidden flex flex-col-reverse">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white text-black rounded-xl p-2 mb-2 shadow-md"
            >
              <strong>{msg.name}</strong> {msg.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input and Emoji Buttons */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Message..."
          className="border p-2 rounded w-full mb-4 text-black"
        />
        <div className="flex space-x-2 mb-4">
          {["😊", "😂", "❤️", "👍", "🎉"].map((emoji) => (
            <button
              key={emoji}
              onClick={() => sendMessage(emoji)}
              className="text-2xl p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
