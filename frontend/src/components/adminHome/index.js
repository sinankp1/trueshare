import "./style.css";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home } from "../../svg";
import { AdminHomeActive } from "../../svg/adminHomeActive";
import Users from "./Users";
import Posts from "./Posts";
export default function HomeComponent({ type }) {
  const { admin } = useSelector((state) => ({ ...state }));
  return (
    <>
      <div className="admin">
        <div className="admin_left">
          <div className="admin_left_header">
            <h3>TrueShare Admin</h3>
            <div className="small_circle">
              <i className="settings_filled_icon"></i>
            </div>
          </div>
          <div className="admin_left_wrap">
            <Link
              to="/admin"
              className={`mmenu_item hover3 ${
                type === "home" && "active_friends"
              }`}
            >
              <div className="small_circle">
                {type === "home" ? <AdminHomeActive /> : <Home color="black" />}
              </div>
              <span>Home</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <Link
              to="/admin/users"
              className={`mmenu_item hover3 ${
                type === "users" && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="all_friends_icon"></i>
              </div>
              <span>Users</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <Link
              to="/admin/posts"
              className={`mmenu_item hover3 ${
                type === "posts" && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="m_post_icon"></i>
              </div>
              <span>Posts</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
          </div>
        </div>
        <div className="admin_right">
          {type === "home" && (
            <div className="homeWrap">
              <div style={{position:"relative"}}>
                <Link to="/admin/users" style={{position:"absolute",right:"5px",top:"5px",zIndex:"999",color:"blue"}}>See all users</Link>
                <Users home />
              </div>
              <div style={{position:"relative"}}>
                <Link to="/admin/posts" style={{position:"absolute",right:"5px",top:"5px",zIndex:"999",color:"blue"}}>See all posts</Link>
                <Posts home />
              </div>
            </div>
          )}
          {type === "users" && <Users />}
          {type === "posts" && <Posts />}
        </div>
      </div>
    </>
  );
}
