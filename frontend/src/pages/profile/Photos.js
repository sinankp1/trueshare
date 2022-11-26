import axios from "axios";
import { useEffect, useReducer } from "react";
import { photosReducer } from "../../functions/reducer";

export default function Photos({ userName, token ,photos}) {

 
  return (
    <div className="profile_card">
      <div className="profile_card_header">        Photos
      </div>
      <div className="profile_card_count">
        {!photos?.total_count
          ? ""
          : photos && photos?.total_count === 1
          ? "1 Photo"
          : `${photos?.total_count} photos`}
      </div>
      <div className="profile_card_grid">
        {photos &&
          photos?.resources &&
          photos.resources.slice(0, 9).map((img) => (
            <div className="profile_photo_card" key={img.public_id}>
              <img src={img.secure_url} alt="" />
            </div>
          ))}
      </div>
    </div>
  );
}
