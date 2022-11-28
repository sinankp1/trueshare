import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import LoginInput from "../inputs/logininput";
import { useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
const loginInfos = {
  email: "",
  password: "",
};
export default function LoginForm({ setVisible, visible, admin }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, setLogin] = useState(loginInfos);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { email, password } = login;
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };
  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required.")
      .email("Must be a valid email.")
      .max(100),
    password: Yup.string().required("Password is required"),
  });
  const loginSubmit = async () => {
    try {
      if (!admin) {
        setLoading(true);
        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/login`,
          {
            email,
            password,
          }
        );
        const { message, ...rest } = data;
        dispatch({ type: "LOGIN", payload: rest });
        Cookies.set("user", JSON.stringify(rest));
        navigate("/");
      } else if (admin) {
        setLoading(true);
        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/admin/adminLogin`,
          {
            email,
            password,
          }
        );
        const { message, ...rest } = data;
        dispatch({ type: "ADMIN_LOGIN", payload: rest });
        Cookies.set("admin", JSON.stringify(rest));
        navigate("/admin");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="login_wrap">
      <div className="login_1">
        <img
          className="login_logo"
          src="../../icons/trueshare_logo.png"
          alt=""
        />
        {admin ? (
          <b style={{fontSize:"40px",color:"#111"}}>Admin</b>
        ) : (
          <span>
            Trueshare helps you connect and share with the people in your life.
          </span>
        )}
      </div>
      <div className="login_2">
        <div className="login_2_wrap">
          <Formik
            enableReinitialize
            initialValues={{
              email,
              password,
            }}
            validationSchema={loginValidation}
            onSubmit={() => {
              loginSubmit();
            }}
          >
            {(formik) => (
              <Form>
                <LoginInput
                  type="text"
                  name="email"
                  placeholder="Email address"
                  onChange={handleLoginChange}
                />
                <LoginInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleLoginChange}
                  bottom
                />
                <button type="submit" className="blue_btn">
                  Log In
                </button>
                <div className="loader_div">
                  <FadeLoader
                    color="#1876f2"
                    loading={loading}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              </Form>
            )}
          </Formik>
          <Link to="/forgot" className="forgot_password">
            Forgotten password?
          </Link>
          {error && <div className="error_text">{error}</div>}
          {!admin && (
            <>
              <div className="sign_splitter"></div>
              <button
                className="blue_btn open_signup"
                onClick={() => {
                  setVisible(true);
                }}
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
