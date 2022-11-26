import axios from "axios";
import { useEffect, useReducer } from "react";
import { photosReducer } from "../../functions/reducer";
import { Link } from "react-router-dom";

export default function Friends({ friends }) {
  return (
    <div className="profile_card">
      <div className="profile_card_header">
        Friends
        <Link to={"/friends"} className="profile_header_link" >See all friends</Link>
      </div>
      {friends && (
        <div className="profile_card_count">
          {!friends?.length
            ? ""
            : friends && friends?.length === 1
            ? "1 Friend"
            : `${friends?.length} friends`}
        </div>
      )}
      <div className="profile_card_grid">
        {friends &&
          friends &&
          friends.slice(0, 9).map((friend, i) => (
            <Link
              to={`/profile/${friend.username}`}
              className="profile_photo_card"
              key={i}
            >
              <img src={friend.picture} alt="" />
              <span>
                {friend.first_name} {friend.last_name}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}
