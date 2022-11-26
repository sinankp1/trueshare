import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Return, Search } from "../../svg";
import useClickOutside from "../../helpers/clickOutSide";
import { Link } from "react-router-dom";
import {
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
  search,
} from "../../functions/user";
export default function SearchMenu({ color, setShowSearchMenu }) {
  const { user } = useSelector((state) => ({ ...state }));
  const [iconVisible, setIconVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const menu = useRef(null);
  const input = useRef(null);
  useClickOutside(menu, () => {
    setShowSearchMenu(false);
  });
  useEffect(() => {
    getHistory();
  }, []);
  console.log(searchHistory);
  useEffect(() => {
    input.current.focus();
  }, []);
  const getHistory = async () => {
    const res = await getSearchHistory(user.token);
    setSearchHistory(res);
  };
  const searchHandler = async () => {
    if (searchTerm === "") {
      setResults("");
    } else {
      const res = await search(searchTerm, user?.token);
      setResults(res);
    }
  };
  const addToSearchHistoryHandler = async (searchUser) => {
    setShowSearchMenu(false);
    const res = await addToSearchHistory(searchUser, user.token);
  };
  const removeSearchHandler = async (searchUser) => {
    await removeFromSearch(searchUser, user.token);
    getHistory();
  };
  return (
    <div className="header_left search_area scrollbar" ref={menu}>
      <div className="search_wrap">
        <div className="header_logo">
          <div
            className="circle hover1"
            onClick={() => {
              setShowSearchMenu(false);
            }}
          >
            <Return color={color} />
          </div>
        </div>
        <div
          className="search"
          onClick={() => {
            input.current.focus();
          }}
        >
          {iconVisible && (
            <div>
              <Search color={color} />
            </div>
          )}
          <input
            type="text"
            placeholder="Search Facebook"
            ref={input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              setIconVisible(false);
            }}
            onKeyUp={searchHandler}
            onBlur={() => {
              setIconVisible(true);
            }}
          />
        </div>
      </div>
      {results == "" && (
        <div className="search_history_header">
          <span>Recent searches</span>
          <Link to="/history">Edit</Link>
        </div>
      )}
      <div className="search_history scrollbar">
        {searchHistory &&
          results == "" &&
          searchHistory
            .sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .map((user) => (
              <div className="searchHistoryItem" key={user?.user?._id}>
                <Link
                  onClick={() => addToSearchHistoryHandler(user?.user?._id)}
                  to={`/profile/${user?.user?.username}`}
                  className="search_user_item hover1"
                >
                  <img src={user?.user?.picture} alt="" />
                  <span>
                    {user?.user?.first_name} {user?.user?.last_name}
                  </span>
                </Link>
                <div
                  className="exit_circle hover1"
                  onClick={() => removeSearchHandler(user.user._id)}
                >
                  <i className="exit_icon"></i>
                </div>
              </div>
            ))}
      </div>
      <div className="search_results scrollbar">
        {results &&
          results.map((user) => (
            <Link
              to={`/profile/${user.username}`}
              className="search_user_item hover1"
              onClick={() => addToSearchHistoryHandler(user._id)}
              key={user._id}
            >
              <img src={user.picture} alt="" />
              <span>
                {user.first_name} {user.last_name}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}
