import "./style.css";
import Header from "../../components/header";
import Conversation from "../../components/conversation";
import ChatOnline from "../../components/chatOnline";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { getConversations } from "../../functions/conversations";
import ChatBox from "../../components/chatBox/ChatBox";
import { io } from "socket.io-client";
import { useRef } from "react";
export default function Messenger() {
  const { user } = useSelector((state) => ({ ...state }));
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null); 
  const socket = useRef();

  
  useEffect(() => {
    if (sendMessage !== null) socket.current.emit("send-message", sendMessage);
  }, [sendMessage]);
  
  useEffect(() => {
    socket.current = io("http://localhost:8800");
    socket.current.emit("new-user-add", user.id);
    socket.current.on("get-users", (users) => setOnlineUsers(users));
  }, [user]);
  useEffect(()=>{
    socket.current.on("receive-message",(data)=>{
      setReceiveMessage(data)
    })
  },[])
  console.log(onlineUsers);
  useEffect(() => {
    const getConversationss = async () => {
      const { data } = await getConversations(user.id, user.token);
      setConversations(data);
    };
    getConversationss();
  }, [user]);

  return (
    <>
      <Header />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations.map((c, i) => (
              <div key={i} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <ChatBox
                chat={currentChat}
                user={user}
                setSendMessage={setSendMessage}
                receiveMessage={receiveMessage}
              />
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
            <ChatOnline />
            <ChatOnline />
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
}
