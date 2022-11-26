import { Link,useNavigate } from "react-router-dom";
import { Dots } from "../../svg";

export default function ProfileMenu() {
  const navigate = useNavigate();
  return (
    <div className="profile_menu_wrap">
      <div className="profile_menu">
        <Link to="/profile" className="profile_menu_active">
          Posts
        </Link>
        <Link to="/friends" className="hover1" >
          Friends
        </Link>
        <div className="p10_dots">
          <Dots />
        </div>
      </div>
    </div>
  );
}
