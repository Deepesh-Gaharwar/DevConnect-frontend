import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from "axios";

const Chat = () => {
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loadingOld, setLoadingOld] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [targetUser, setTargetUser] = useState(null);



  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // keep socket reference
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);
  const initialLoadRef = useRef(true);
  const scrollTimeoutRef = useRef(null);
  const bottomRef = useRef(null);



  // auto scroll
  useEffect(() => {
    if (!messages.length || !bottomRef.current) return;

    // FIRST LOAD - force scroll
    if (initialLoadRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
      initialLoadRef.current = false;
      return;
    }

    // prevent jump when loading old messages
    if (loadingOld) return;

    // new message logic
    const container = chatContainerRef.current;
    if (!container) return;

    const threshold = 100;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;

    if (isNearBottom) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loadingOld]);


  // fetch target user details

  useEffect(() => {
    if (!targetUserId) return;

    const fetchTargetUser = async () => {
      const res = await axios.get(`${BASE_URL}/user/${targetUserId}`, {
        withCredentials: true,
      });
      setTargetUser(res.data);
    };

    fetchTargetUser();
  }, [targetUserId]);

  // fetching last seen 
  const fetchLastSeen = async () => {
    const res = await axios.get(`${BASE_URL}/user/last-seen/${targetUserId}`, {
      withCredentials: true,
    });

    setLastSeen(res.data.lastSeenAt);
  };


  // fetch chat messages
  const fetchChatMessages = async (before = null) => {
    if (loadingOld || !hasMore) return;

    try {
      setLoadingOld(true);

      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        params: { before },
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => ({
        senderId: msg.senderId._id,
        text: msg.text,
        createdAt: msg.createdAt,
      }));

      setMessages((prev) => [...chatMessages, ...prev]);
      setHasMore(chat.data.hasMore);

    } catch (error) {
      console.error("Error fetching chat messages", error);

    } finally {
      setLoadingOld(false);
    }
  };

  useEffect(() => {
    if (!targetUserId) return;

    setMessages([]);
    setHasMore(true);
    initialLoadRef.current = true; // reset

    fetchLastSeen();
    fetchChatMessages();
  }, [targetUserId]);



  // as soon as my page loaded, the socket connection is made and joinCHat event is emitted
  useEffect(() => {
    if (!userId || !targetUserId) {
      return;
    }

    // create socket only once
    if (!socketRef.current) {
      socketRef.current = createSocketConnection();
    }

    const socket = socketRef.current;

    // send events to the server
    socket.emit("joinChat", { targetUserId });

    // receive full online users list
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(new Set(users));
    });

    const messageHandler = ({ senderId, text }) => {
      setMessages((prev) => [
        ...prev,
        {
          senderId,
          text,
          createdAt: new Date().toISOString(),
        },
      ]);
    };

    // client is receiving the messages from server
    // socket.on("messageReceived", ({ firstName, lastName, text }) => {
    //   setMessages((messages) => [
    //     ...messages,
    //     {
    //       firstName,
    //       lastName,
    //       text,
    //     },
    //   ]);
    // });

    socket.on("messageReceived", messageHandler);

    socket.on("userOnline", ({ userId }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socket.on("userOffline", ({ userId, lastSeenAt }) => {
      setOnlineUsers((prev) => {
        const copy = new Set(prev);
        copy.delete(userId);
        return copy;
      });

      if (userId === targetUserId) {
        setLastSeen(lastSeenAt);
      }
    });

    socket.on("messagesSeen", ({ seenBy }) => {
     //  console.log("Messages seen by:", seenBy);
    });

    socket.on("errorMessage", (msg) => {
      console.error("Socket error:", msg);
    });

    // as soon as my component unmounts, disconnect from my socket
    return () => {
      socket.off("messageReceived", messageHandler);
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("messagesSeen");
      socket.off("errorMessage");
      socket.off("onlineUsers");
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    setIsOnline(onlineUsers.has(targetUserId));
  }, [onlineUsers, targetUserId]);


  // sendMessage function
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.emit("sendMessage", {
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  // handling scroll up -> load older messages
  const handleScroll = (e) => {
    const el = chatContainerRef.current;
    if (!el || loadingOld) return;

    if (el.scrollTop === 0 && messages.length) {
      fetchChatMessages(messages[0].createdAt);
    }
  };

  // last seen text func
  const getLastSeenText = () => {
    if (isOnline) return "Online";
    if (!lastSeen) return "Offline";

    const diffMs = Date.now() - new Date(lastSeen).getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day; // approximate month

    if (diffMs < minute) return "Last seen just now";

    if (diffMs < hour) {
      const minutes = Math.floor(diffMs / minute);
      return `Last seen ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    if (diffMs < day) {
      const hours = Math.floor(diffMs / hour);
      return `Last seen ${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    if (diffMs < month) {
      const days = Math.floor(diffMs / day);
      return `Last seen ${days} day${days > 1 ? "s" : ""} ago`;
    }

    const months = Math.floor(diffMs / month);
    return `Last seen ${months} month${months > 1 ? "s" : ""} ago`;
  };


  return (
    <div className="w-full md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto mt-6 h-[80vh] bg-[#0f172a] rounded-xl flex flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-700">
        <img
          src={targetUser?.photoUrl || "/default-avatar.png"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <p className="font-semibold text-sm">
            {targetUser?.firstName} {targetUser?.lastName}
          </p>
          <p className="text-xs text-gray-400">{getLastSeenText()}</p>
        </div>
      </div>

      {/* CHAT BODY */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      >
        {messages.map((msg, index) => {
          const isMe = msg.senderId === userId;

          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-xl px-3 py-2 text-sm ${
                  isMe ? "bg-[#1d4ed8]" : "bg-[#1f2937]"
                }`}
              >
                <p>{msg.text}</p>

                <div className="flex justify-end text-[10px] mt-1 text-gray-300">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isMe && <span className="ml-1">✔✔</span>}
                </div>
              </div>
            </div>
          );
        })}

        {/* required for auto scroll */}
        <div ref={bottomRef} className="h-1 w-full" />
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-gray-700">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-sm font-medium cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;