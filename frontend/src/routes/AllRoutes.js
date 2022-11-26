import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Profile from "../pages/profile";
import Home from "../pages/home";
import Friends from "../pages/friends"
import LoggedInRoutes from "./LoggedInRoutes";
import NotLoggedInRoute from "./NotLoggedInRoute";
import Activate from "../pages/home/activate";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useReducer, useState } from "react";
import { postsReducer } from "../functions/reducer";
import { getAllPosts } from "../functions/getAllPosts";
import CreatePostPopup from "../components/createPostPopup";

export default function AllRoutes() {
  const { user } = useSelector((state) => ({ ...state }));
  const [{ loading, error, posts }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (user && user?.verified) {
      getAllPosts(dispatch, user);
    }
  }, [user]);
  return (
    <>
      {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          posts={posts}
          dispatch={dispatch}
        />
      )}
      <Routes>
        <Route element={<NotLoggedInRoute />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
        <Route element={<LoggedInRoutes />}>
          <Route
            path="/profile"
            element={<Profile setVisible={setVisible} />}
            exact
          />
          <Route
            path="/friends"
            element={<Friends setVisible={setVisible} />}
            exact
          />
          <Route
            path="/friends/:type"
            element={<Friends setVisible={setVisible} />}
            exact
          />
          <Route
            path="/profile/:username"
            element={<Profile setVisible={setVisible} />}
            exact
          />
          <Route
            path="/"
            element={<Home posts={posts} setVisible={setVisible} />}
            exact
          />
          <Route path="/activate/:token" element={<Activate />} exact />
        </Route>
      </Routes>
    </>
  );
}
