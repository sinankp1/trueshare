import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import CreatePost from "../../components/createPost";
import ActivateForm from "./ActivateForm";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export default function Activate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  useEffect(() => {
    activateAccount();
  }, []);
  async function activateAccount() {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/activate`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSuccess(data.message);
      Cookies.set(
        "user",
        JSON.stringify({ ...user, verified: true })
      );
      dispatch({
        type: "VERIFY",
        payload: true,
      });
      setTimeout(()=>{
        navigate("/")
      },3000)
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(()=>{
        navigate("/")
      },3000)
    }
  }

  return (
    <div className="home">
      {success && (
        <ActivateForm
          type="success"
          header="Account verification success"
          text={success}
          loading={loading}
        />
      )}
      {error && (
        <ActivateForm
          type="error"
          header="Account verification failed"
          text={error}
          loading={loading}
        />
      )}

      <Header />
      <LeftHome user={user} />
      <div className="home_middle">
        <CreatePost user={user} />
      </div>
      <RightHome user={user} />
    </div>
  );
}
