import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import useClickOutSidde from "../../helpers/clickOutSide";
import "./style.css";
import UpdateProfilePicture from "./UpdateProfilePicture";
export default function ProfilePicture({ setShow, pRef, photos }) {
  const refInput = useRef(null);
  const popup = useRef(null);
  const { user } = useSelector((state) => ({ ...state }));
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const handleChange = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
      setError("please select an image file");
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      setError("Image size should not be greater than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setImage(event.target.result);
    };
  };
  return (
    <div className="blur1">
      <input
        type="file"
        ref={refInput}
        hidden
        onChange={handleChange}
        accept="image/jpeg,image/webp,image/png"
      />
      <div className="postBox pictureBox" ref={popup}>
        <div className="box_header">
          <div
            className="small_circle"
            onClick={() => {
              setShow(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Update profile picture</span>
        </div>
        <div className="update_picture_wrap">
          <div className="update_picture_buttons">
            <button
              className="light_blue_btn"
              onClick={() => {
                refInput.current.click();
              }}
            >
              <i className="plus_icon"></i>
              Upload photo
            </button>
            <button className="gray_btn">
              <i className="framems_icon"></i>
              Upload photo
            </button>
          </div>
        </div>
        {error && (
          <div className="postError comment_error">
            <div className="postError_error">{error}</div>
            <button
              className="blue_btn"
              onClick={() => {
                setError("");
              }}
            >
              Try again
            </button>
          </div>
        )}
        <div className="old_pictures_wrap">
          <h4>Your profile pictures</h4>
          <div className="old_pictures">
            {photos &&
              photos.length &&
              photos
                .filter(
                  (img) => img.folder === `${user.username}/profile_pictures`
                )
                .map((photo) => (
                  <img
                    src={photo.secure_url}
                    key={photo.public_id}
                    alt=""
                    style={{ width: "100px" }}
                    onClick={()=>setImage(photo.secure_url)}
                  />
                ))}
          </div>
          <h4>Other pictures</h4>
          <div className="old_pictures">
            {photos &&
              photos.length &&
              photos
                .filter(
                  (img) => img.folder !== `${user.username}/profile_pictures`
                )
                .map((photo) => (
                  <img
                    src={photo.secure_url}
                    key={photo.public_id}
                    alt=""
                    style={{ width: "100px" }}
                  />
                ))}
          </div>
        </div>
      </div>
      {image && (
        <UpdateProfilePicture
          image={image}
          setImage={setImage}
          setShow={setShow}
          setError={setError}
          pRef={pRef}
        />
      )}
    </div>
  );
}