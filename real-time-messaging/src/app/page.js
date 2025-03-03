"use client"; // Required for client-side WebSockets
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

const socket = io("wss://christ-session.onrender.com");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, []);
  const sendMessage = () => {
    if (message.trim() === "" && emoji.trim() === "") return;
  
    const newMessage = { name: "You", text: message, emoji, sender: socket.id };
    
    socket.emit("sendMessage", newMessage); 
    
    setMessage("");
    setEmoji("");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-between bg-[#e7e7f1] p-4 gap-2">
      <div className="w-full max-w-md rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-2 h-full">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === socket.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg shadow-md max-w-xs ${
                    msg.sender === socket.id ? "bg-[#5630c2] text-white" : "bg-gray-300 text-black"
                  }`}
                >
                  <strong>{msg.sender === socket.id ? "You" : msg.name}</strong>: {msg.text} {msg.emoji}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      {/* Input Area */}
      <div className=" flex items-center justify-center w-full max-w-md gap-5">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-3  border-b-2 border-b-[#5630c2] text-black focus:outline-0"
        />
        <button
          onClick={sendMessage}
          className="w-fit p-3 bg-[#5630c2] text-white rounded-xl cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}
