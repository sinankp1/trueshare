import axios from "axios";
import { useEffect, useState } from "react";
import "./style.css";
export default function Conversation({ conversation, currentUser }) {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const userId = conversation.members.find((id) => id !== currentUser.id);
    console.log(userId);
    const getUserData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/getUser/${userId}`,
          { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, []);
  return (
    <div className="conversation">
      <img src={userData?.picture} className="conversationImg" alt="" />
      <span className="conversationName">
        {userData?.first_name} {userData?.last_name}
      </span>
    </div>
  );
}
