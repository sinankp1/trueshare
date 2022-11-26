import React, { useState } from "react";
import { useRef } from "react";
import useClickOutSidde from "../../helpers/clickOutSide";

export default function Cover({ cover, visitor }) {
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const menuRef = useRef(null);
  useClickOutSidde(menuRef, () => {
    setShowCoverMenu(false);
  });
  return (
    <div className="profile_cover">
      {cover && <img src={cover} className="cover" alt="" />}
      {!visitor && (
        <div className="udpate_cover_wrapper" ref={menuRef}>
          {/* <div
            className="open_cover_update"
            onClick={() => {
              setShowCoverMenu((prev) => !prev);
            }}
          >
            <i className="camera_filled_icon"></i>
            Add cover photo
          </div> */}
          {showCoverMenu && (
            <div className="open_cover_menu">
              <div className="open_cover_menu_item hover1">
                <i className="photo_icon"></i>
                Select Photo
              </div>
              <div className="open_cover_menu_item hover1">
                <i className="upload_icon"></i>
                Upload Photo
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
