import { useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "../../components/profilePicture";
import Friendship from "./Friendship";

export default function ProfilePictureInfos({ profile, visitor, photos }) {
  const [show, setShow] = useState(false);
  const pRef = useRef(null);
  return (
    <div className="profile_img_wrap">
      {show && <ProfilePicture setShow={setShow} pRef={pRef} photos={photos} />}
      <div className="profile_w_left">
        <div className="profile_w_img">
          <div
            className="profile_w_bg"
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${profile?.picture})`,
            }}
            ref={pRef}
          ></div>
          {!visitor && (
            <div
              className="profile_circle hover1"
              onClick={() => {
                setShow(true);
              }}
            >
              <i className="camera_filled_icon"></i>
            </div>
          )}
        </div>
        <div className="profile_w_col">
          <div className="profile_name">
            {profile?.first_name} {profile?.last_name}
          </div>
          <div className="profile_friend_count">
            {profile?.friends && (
              <div className="profile_card_count">
                {!profile?.friends?.length
                  ? ""
                  : profile?.friends && profile?.friends?.length === 1
                  ? "1 Friend"
                  : `${profile?.friends?.length} friends`}
              </div>
            )}
          </div>
          <div className="profile_friend_imgs">
            {profile.friends &&
              profile.friends.slice(0, 6).map((friend, i) => (
                <Link to={`/profile/${friend.username}`} key={i}>
                  <img
                    src={friend.picture}
                    key={i}
                    alt=""
                    style={{ transform: `translateX(-${5 * i}px)` }}
                  />
                </Link>
              ))}
          </div>
        </div>
      </div>
      {visitor ? (
        <Friendship friendshipp={profile?.friendship} profileid={profile._id} />
      ) : (
        // <div className="profile_w_right">
        //   <div className="blue_btn">
        //     <img src="../../../icons/plus.png" alt="" className="invert" />
        //     <span>Add to story</span>
        //   </div>
        //   <div className="gray_btn">
        //     <i className="edit_icon"></i>
        //     <span>Edit profile</span>
        //   </div>
        // </div>
        ""
      )}
    </div>
  );
}
