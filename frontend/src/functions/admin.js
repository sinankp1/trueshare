import axios from "axios";
export const getAllUsers = async (token) => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/admin/getAllUsers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {status:"ok",data:data};
  } catch (error) {
    return error.response.data.message;
  }
};
export const blockUser = async (id,token) => {
  try {
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/admin/blockUser`,{id},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {status:"ok",data:data};
  } catch (error) {
    return error.response.data.message;
  }
};