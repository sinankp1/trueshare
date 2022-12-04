import axios from "axios";

export const getConversations = async (userId, token) => {
  try {
    const res = axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/conversation/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    return error;
  }
};
export const getMessages = async (conversationId, token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/messages/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    return error;
  }
};
export const sendMessage = async (message, token) => {
  try {
    const res = axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/messages`,
      message,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    return error;
  }
};
