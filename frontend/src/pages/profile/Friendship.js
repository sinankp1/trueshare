import { useEffect } from "react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  acceptRequest,
  addFriend,
  cancelRequest,
  deleteRequest,
  follow,
  unfollow,
  unfriend,
} from "../../functions/user";
import useClickOutSidde from "../../helpers/clickOutSide";

export default function Friendship({ friendshipp, profileid }) {
  const [friendship, setFriendship] = useState(friendshipp);
  useEffect(() => {
    setFriendship(friendshipp);
  }, [friendshipp]);
  const menu = useRef(null);
  const menu1 = useRef(null);
  const [friendsMenu, setFriendsMenu] = useState(false);
  const [respondMenu, setRespondMenu] = useState(false);
  useClickOutSidde(menu, () => {
    setFriendsMenu(false);
  });
  useClickOutSidde(menu1, () => {
    setRespondMenu(false);
  });
  const { user } = useSelector((state) => ({ ...state }));
  const addFriendHandler = async () => {
    setFriendship({ ...friendship, requestSent: true, following: true });
    await addFriend(profileid, user.token);
  };
  const cancelRequestHandler = async () => {
    setFriendship({ ...friendship, requestSent: false, following: false });
    await cancelRequest(profileid, user.token);
  };
  const followHandler = async () => {
    setFriendship({ ...friendship, following: true });
    await follow(profileid, user.token);
  };
  const unfollowHandler = async () => {
    setFriendship({ ...friendship, following: false });
    await unfollow(profileid, user.token);
  };
  const acceptRequestHandler = async () => {
    setFriendship({
      ...friendship,
      following: true,
      friends: true,
      requestSent: false,
      requestReceived: false,
    });
    await acceptRequest(profileid, user.token);
  };
  const unfriendHandler = async () => {
    setFriendship({
      ...friendship,
      following: false,
      friends: false,
      requestSent: false,
      requestReceived: false,
    });
    await unfriend(profileid, user.token);
  };
  const deleteRequestHandler = async () => {
    setFriendship({
      ...friendship,
      following: false,
      friends: false,
      requestSent: false,
      requestReceived: false,
    });
    await deleteRequest(profileid, user.token);
  };
  return (
    <div className="friendship">
      {friendship?.friends ? (
        <div className="friends_menu_wrap" ref={menu}>
          <button
            className="gray_btn"
            onClick={() => setFriendsMenu((prev) => !prev)}
          >
            <img src="../../../icons/friends.png" alt="" />
            <span>Friends</span>
          </button>
          {friendsMenu && (
            <div className="open_cover_menu">
              <div className="open_cover_menu_item hover1">
                <img src="../../../icons/favoritesOutline.png" alt="" />
                Favorites
              </div>
              <div className="open_cover_menu_item hover1">
                <img src="../../../icons/editFriends.png" alt="" />
                Edit friend list
              </div>

              {friendship?.following ? (
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => unfollowHandler()}
                >
                  <img src="../../../icons/unfollowOutlined.png" alt="" />
                  Unfollow
                </div>
              ) : (
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => followHandler()}
                >
                  <img src="../../../icons/unfollowOutlined.png" alt="" />
                  Follow
                </div>
              )}
              <div
                className="open_cover_menu_item hover1"
                onClick={() => unfriendHandler()}
              >
                <i className="unfriend_outlined_icon"></i>
                Unfriend
              </div>
            </div>
          )}
        </div>
      ) : (
        !friendship?.requestSent &&
        !friendship?.requestReceived && (
          <button className="blue_btn" onClick={() => addFriendHandler()}>
            <img src="../../../icons/addFriend.png" alt="" className="invert" />
            <span>Add friend</span>
          </button>
        )
      )}
      {friendship?.requestSent ? (
        <button className="blue_btn" onClick={() => cancelRequestHandler()}>
          <img
            src="../../../icons/cancelRequest.png"
            alt=""
            className="invert"
          />
          Cancel Request
        </button>
      ) : (
        friendship?.requestReceived && (
          <div className="friends_menu_wrap" ref={menu1}>
            <button
              className="gray_btn"
              onClick={() => setRespondMenu((prev) => !prev)}
            >
              <img src="../../../icons/friends.png" alt="" />
              <span>Respond</span>
            </button>
            {respondMenu && (
              <div className="open_cover_menu">
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => acceptRequestHandler()}
                >
                  <img src="../../../icons/favoritesOutline.png" alt="" />
                  Confirm
                </div>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => deleteRequestHandler()}
                >
                  <img src="../../../icons/editFriends.png" alt="" />
                  Delete
                </div>
              </div>
            )}
          </div>
        )
      )}
      <div className="flex">
        {friendship?.following ? (
          <button className="gray_btn" onClick={() => unfollowHandler()}>
            <img src="../../../icons/follow.png" alt="" />
            <span>Following</span>
          </button>
        ) : (
          <button className="blue_btn" onClick={() => followHandler()}>
            <img src="../../../icons/follow.png" alt="" className="invert" />
            <span>Follow</span>
          </button>
        )}
        <button className={friendship?.friends ? "blue_btn" : "gray_btn"}>
          <img
            src="../../../icons/message.png"
            alt=""
            className={friendship?.friends ? "invert" : ""}
          />
          <span>Message</span>
        </button>
      </div>
    </div>
  );
}
