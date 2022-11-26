import "./style.css";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  Friends,
  FriendsActive,
  Home,
  HomeActive,
  Logo,
  Market,
  Menu,
  Messenger,
  Notifications,
  Search,
} from "../../svg";
import { useSelector } from "react-redux";
import SearchMenu from "./SearchMenu";
import { useRef, useState } from "react";
import AllMenu from "./AllMenu";
import useClickOutside from "../../helpers/clickOutSide";
import UserMenu from "./userMenu";
export default function Header({page}) {
  const { user } = useSelector((user) => ({ ...user }));
  const color = "#65676b";
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const allmenu = useRef(null);
  const usermenu = useRef(null);
  useClickOutside(allmenu, () => {
    setShowAllMenu(false);
  });
  useClickOutside(usermenu, () => {
    setShowUserMenu(false);
  });
  return (
    <header>
      <div className="header_left">
        <Link to="/" className="header_logo">
          <div className="circle">
            <Logo />
          </div>
        </Link>
        <div
          className="search search1"
          onClick={() => {
            setShowSearchMenu(true);
          }}
        >
          <Search color={color} />
          <input
            type="text"
            placeholder="Search Trueshare"
            className="hide_input"
          />
        </div>
      </div>
      {showSearchMenu && (
        <SearchMenu color={color} setShowSearchMenu={setShowSearchMenu} />
      )}
      <div className="header_middle mx-auto">
        <Link to="/" className={`middle_icon ${page ==="home" ? "active" : "hover1"}`}>
       {
        page === "home" ?  <HomeActive /> : <Home color={color}/>
       }
         
        </Link>
        <Link to="/friends"  className={`middle_icon ${page ==="friends" ? "active" : "hover1"}`}>
        {
        page === "friends" ?  <FriendsActive /> : <Friends color={color}/>
       }
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Market color={color} />
        </Link>
      </div>
      <div className="header_right">
        <Link to="/profile" className={`profile_link ${page === "profile" ? "active_link":"hover1"}`}>
          <img src={user?.picture} alt="" />
          <span>{user?.first_name}</span>
        </Link>
        <div className="circle_icon hover1">
          <Messenger />
        </div>
        <div className={showUserMenu ?"circle_icon hover1 active_header" : "circle_icon hover1"} ref={usermenu}>
          <div
            className="circle"
            onClick={() => {
              setShowUserMenu((prev) => !prev);
            }}
          >
            <ArrowDown />
          </div>

          {showUserMenu && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
}
