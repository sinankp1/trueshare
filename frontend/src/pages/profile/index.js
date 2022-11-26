import axios from "axios";
import { useEffect, useState } from "react";
import { useReducer } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { profileReducer } from "../../functions/reducer";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import CreatePost from "../../components/createPost";
import Post from "../../components/post";
import "./style.css";
import Cover from "./Cover";
import ProfilePictureInfos from "./ProfilePictureInfos";
import ProfileMenu from "./ProfileMenu";
import GridPost from "./GridPost";
import Photos from "./Photos";
import Friends from "./Friends";
import Intro from "../../components/intro";
import CreatePostPopup from "../../components/createPostPopup";
export default function Profile({  }) {
  const [visible,setVisible] = useState(false)
  const { user } = useSelector((state) => ({ ...state }));
  const { username } = useParams();
  const [photos, setPhotos] = useState({});
  const userName = username === undefined ? user.username : username;
  const navigate = useNavigate();
  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: false,
    profile: {},
    error: "",
  });
  useEffect(() => {
    getProfile();
  }, [userName]);
  var visitor = userName === user.username ? false : true;
  const path = `${userName}/*`;
  const max = 30;
  const sort = "desc";
  const getProfile = async () => {
    try {
      dispatch({
        type: "PROFILE_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getProfile/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (data.ok === false) {
        navigate("/profile");
      } else {
        try {
          const images = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/listImages`,
            { path, sort, max },
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setPhotos(images.data)
        } catch (error) {}
        dispatch({
          type: "PROFILE_SUCCESS",
          payload: data,
        });
      }
    } catch (error) {
      dispatch({
        type: "PROFILE_ERROR",
        payload: error.response.data.message,
      });
    }
  };
  return (
    <div className="profile">
       {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          posts={profile?.posts}
          dispatch={dispatch}
          profile
        />
      )}
      <Header page="profile" />
      <div className="profile_top">
        <div className="profile_container">
          <Cover cover={profile?.cover} visitor={visitor} />
          <ProfilePictureInfos profile={profile} visitor={visitor} photos={photos.resources} />
          <ProfileMenu />
        </div>
      </div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            <div className="profile_grid">
              <div className="profile_left">
                {/* <Intro details={profile.details}/> */}
                <Photos userName={userName} token={user?.token} photos={photos} />
                <Friends friends={profile?.friends} />
              </div>
              <div className="profile_right">
                {!visitor && (
                  <CreatePost user={user} profile setVisible={setVisible} />
                )}
                <div className="posts">
                  {profile.posts && profile.posts.length ? (
                    profile?.posts.map((post) => (
                      <Post post={post} user={user} key={post._id} />
                    ))
                  ) : (
                    <div className="no_posts">No Post available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
