import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from "axios";

const Chat = () => {
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // fetch chat messages
  const fetchChatMessages = async() => {
    const chat = await axios.get(BASE_URL+ "/chat/"+targetUserId, 
      {
        withCredentials: true,
      });

    const chatMessages = chat?.data?.messages.map((msg) => {
      const {senderId, text} = msg;

      return {
        firstName: senderId?.firstName, 
        lastName: senderId?.lastName,
        text,
      }
    });

    setMessages(chatMessages);
  }

  useEffect(() => {
    fetchChatMessages();
  })

  // keep socket reference
  const socketRef = useRef(null);

  // as soon as my page loaded, the socket connection is made and joinCHat event is emitted
  useEffect(() => {
    if (!userId) {
      return;
    }

    const socket = createSocketConnection();
    socketRef.current = socket;

    // send events to the server
    socket.emit("joinChat", { userId, targetUserId });

    // client is receiving the messages from server
    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((messages) => [
        ...messages,
        {
          firstName,
          lastName,
          text,
        },
      ]);
    });

    // as soon as my component unmounts, disconnect from my socket
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // sendMessage function
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket =  socketRef.current;

    socket.emit("sendMessage", {
      firstName: user?.firstName,
      lastName: user?.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>

      {/* Display Messages */}
      <div className="flex-1 overflow-scroll p-5">
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={
                "chat" +
                (user?.firstName == msg.firstName ? "chat-end" : "chat-start")
              }
            >
              <div className="chat-header">
                {`${msg.firstName} ${msg.lastName}`}
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );

        })}
      </div>

      {/* Input Box */}
      <div className="p-5 border-t border-gray-950 flex gap-2 items-center">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-600 bg-transparent text-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-gray-500"
        ></input>
        <button onClick={sendMessage} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;