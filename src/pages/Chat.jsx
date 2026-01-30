import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';

const Chat = () => {

    const { targetUserId } = useParams();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const user = useSelector(store => store.user);
    const userId = user?._id;

  // as soon as my page loaded, the socket connection is made and joinCHat event is emitted
  useEffect(() => {
    
    if(!userId) {
      return;
    }

    const socket = createSocketConnection();

    // send events to the server
    socket.emit("joinChat", { userId, targetUserId });

    // client is receiving the messages from server
    socket.on("messageReceived", ({firstName, text}) => {
      setMessages((messages) => [...messages, {
        firstName,
        text
      }]);
    });

    // as soon as my component unmounts, disconnect from my socket
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  
  // sendMessage function
  const sendMessage = () => {
    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      firstName: user.firstName, 
      userId, 
      targetUserId, 
      text: newMessage
    }); 

    setNewMessage("");
  }

  return (
    <div className='w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col'>
      <h1 className="p-5 border-b border-gray-600">Chat</h1>

      {/* Display Messages */}
      <div className='flex-1 overflow-scroll p-5'>
        {messages.map((msg, index) => {
            return (
              <div 
                key={index}
              className="chat chat-start">
                <div className="chat-header">
                  {msg.firstName}
                  <time className="text-xs opacity-50">2 hours ago</time>
                </div>
                <div className="chat-bubble"> 
                  {msg.text}
                </div>
                <div className="chat-footer opacity-50">Seen</div>
              </div>
            );
        })}
      </div>

      {/* Input Box */}
      <div className='p-5 border-t border-gray-600 flex gap-2 items-center'>
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className='flex-1 border-gray-500 text-white rounded p-2'>

          </input>
        <button 
          onClick={sendMessage}
          className='btn btn-secondary'
          >
            Send

          </button>
      </div>
    </div>
  );
}

export default Chat;