import {useNavigate} from "react-router-dom"
import { Form, Formik } from "formik";
import { useState } from "react";
import RegisterInput from "../inputs/registerinput";
import * as Yup from "yup";
import DateOfBirthSelect from "./DateOfBirthSelect";
import GenderSelect from "./GenderSelect";
import FadeLoader from "react-spinners/FadeLoader";
import axios from "axios";
import {useDispatch} from "react-redux"
import Cookies from "js-cookie"
const userInfos = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  bYear: new Date().getFullYear(),
  bMonth: new Date().getMonth(),
  bDay: new Date().getDate(),
  gender: "",
};
export default function RegisterForm({setVisible}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(userInfos);
  const [dateError, setDateError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    first_name,
    last_name,
    email,
    password,
    bYear,
    bMonth,
    bDay,
    gender,
  } = user;
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const registerValidation = Yup.object({
    first_name: Yup.string()
      .required()
      .min(4)
      .max(30)
      .matches(/^[aA-zZ\s]+$/, "Number and special characters are not allowed"),
    last_name: Yup.string()
      .required()
      .min(1)
      .max(30)
      .matches(/^[aA-zZ]+$/, "Number and special characters are not allowed"),
    email: Yup.string().required().email(),
    password: Yup.string().required().min(6).max(40),
  });
  const registerSubmit = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/register`,
        {
          first_name,
          last_name,
          email,
          password,
          bYear,
          bMonth,
          bDay,
          gender,
        }
      );
      setError("")
      setSuccess(data.message);
      const {message,...rest} = data;
      setTimeout(() => {
        dispatch({type:"LOGIN",payload:rest})
        Cookies.set("user",JSON.stringify(rest))
        navigate('/')
      }, 2000);
    } catch (error) {
      setSuccess("");
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  const tempYear = new Date().getFullYear();
  const years = Array.from(new Array(108), (val, index) => tempYear - index);
  const months = Array.from(new Array(12), (val, index) => 1 + index);
  const getDays = () => {
    return new Date(bYear, bMonth, 0).getDate();
  };
  const days = Array.from(new Array(getDays()), (val, index) => 1 + index);
  return (
    <div className="blur">
      <div className="register">
        <div className="register_header">
          <i className="exit_icon" onClick={()=>{
            setVisible(false)
          }}></i>
          <span>Sign Up</span>
          <span>it's quick and easy</span>
        </div>
        <Formik
          enableReinitialize
          validationSchema={registerValidation}
          initialValues={{
            first_name,
            last_name,
            email,
            password,
            bYear,
            bMonth,
            bDay,
            gender,
          }}
          onSubmit={() => {
            const currentDate = new Date();
            const pickedDate = new Date(bYear, bMonth - 1, bDay);
            const atleast14 = new Date(1970 + 14, 0, 1);
            const noMoreThan70 = new Date(1970 + 70, 0, 1);
            if (
              currentDate - pickedDate < atleast14 ||
              currentDate - pickedDate > noMoreThan70
            ) {
              setDateError("Your age should be between 14 and 70 to sign up");
            } else if (gender === "") {
              setDateError("");
              setGenderError("Please select your gender");
            } else {
              setDateError("");
              setGenderError("");
              registerSubmit();
            }
          }}
        >
          {(formik) => (
            <Form className="register_form">
              <div className="reg_line">
                <RegisterInput
                  type="text"
                  placeholder="First name"
                  name="first_name"
                  onChange={handleRegisterChange}
                />
                <RegisterInput
                  type="text"
                  placeholder="Surname"
                  name="last_name"
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="reg_line">
                <RegisterInput
                  type="text"
                  placeholder="Email address"
                  name="email"
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="reg_line">
                <RegisterInput
                  type="password"
                  placeholder="New password"
                  name="password"
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="reg_col">
                <div className="reg_line_header">
                  Date of birth <i className="info_icon"></i>
                </div>
                <DateOfBirthSelect
                  bDay={bDay}
                  bMonth={bMonth}
                  bYear={bYear}
                  days={days}
                  years={years}
                  months={months}
                  handleRegisterChange={handleRegisterChange}
                  dateError={dateError}
                />
              </div>
              <div className="reg_col">
                <div className="reg_line_header">
                  Gender <i className="info_icon"></i>
                </div>
                <GenderSelect
                  handleRegisterChange={handleRegisterChange}
                  genderError={genderError}
                />
              </div>
              <div className="reg_infos">
                By clicking Sign Up, you agree to our{" "}
                <span>Terms, Data Policy &nbsp;</span>
                and <span>Cookie Policy.</span> You may receive SMS
                notifications from us and can opt out at any time.
              </div>
              <div className="reg_btn_wrapper">
                <button className="blue_btn open_signup" type="submit">
                  Sign Up
                </button>
              </div>
              <FadeLoader
                color="#1876f2"
                loading={loading}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              {error && <div className="error_text">{error}</div>}
              {success && <div className="success_text">{success}</div>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
