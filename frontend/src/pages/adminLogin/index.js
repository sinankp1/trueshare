import "./style.scss";
import LoginForm from "../../components/login/LoginForm";
export default function Login() {
  return (
    <div className="login">
      <div className="login_wrapper">
        <LoginForm admin />
      </div>
    </div>
  );
}
