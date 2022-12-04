import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage } from "../../functions/conversations";
import Message from "../message";

export default function ChatBox({
  chat,
  user,
  setSendMessage,
  receiveMessage,
}) {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef()

    useEffect(()=>{
        if(receiveMessage !== null && receiveMessage.conversationId === chat._id){
            setMessages(prev=>[...prev,receiveMessage])
        }
    },[receiveMessage])

  useEffect(() => {
    const userId = chat?.members.find((id) => id !== user?.id);
    const getUserData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/getUser/${userId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        console.log(data);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [chat]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user.id,
      text: newMessage,
      conversationId: chat._id,
    };
    try {
      const { data } = await sendMessage(message, user.token);
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }

    const recieverId = chat.members.find((id) => id !== user.id);
    console.log(recieverId);
    setSendMessage({ ...message, recieverId });
  };
  useEffect(()=>{
    scroll.current?.scrollIntoView({behavior:"smooth"})
  },[messages])
  return (
    <>
      <div className="chatBoxTop scrollbar">
        {messages &&
          messages.length &&
          messages.map((message, i) => (
            <div key={i} ref={scroll}>
              <Message own={message.sender === user?.id} message={message} />
            </div>
          ))}
      </div>
      <div className="chatBoxBottom">
        <textarea
          placeholder="Write something"
          className="chatMessageInput"
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
          value={newMessage}
        ></textarea>
        <button className="chatSubmitButton" onClick={handleSubmit}>
          Send
        </button>
      </div>
    </>
  );
}
