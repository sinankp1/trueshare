import { useRef, useState } from "react";
import "./style.css";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import AddToYouPost from "./AddToYouPost";
import ImagePreview from "./ImagePreview";
import useClickOutSide from "../../helpers/clickOutSide";
import { createPost } from "../../functions/post";
import PulseLoader from "react-spinners/PulseLoader";
import PostError from "./PostError";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { uploadImages } from "../../functions/uploadImages";
export default function CreatePostPopup({
  user,
  setVisible,
  posts,
  dispatch,
  profile,
}) {
  const popup = useRef(null);
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [background, setBackground] = useState("");
  const [error, setError] = useState("");
  useClickOutSide(popup, () => {
    setVisible(false);
  });
  const postSubmit = async () => {
    if (background && text.trim()) {
      setLoading(true);
      const res = await createPost(
        null,
        background,
        text,
        null,
        user.id,
        user.token
      );
      setLoading(false);
      if (res.status === "ok") {
        dispatch({
          type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
          payload: [res.data, ...posts],
        });
        setText("");
        setBackground("");
        setVisible(false);
      } else {
        setError(res);
      }
    } else if (images && images.length) {
      setLoading(true);
      const postImages = images.map((img) => {
        return dataURItoBlob(img);
      });
      console.log(postImages,'kkkkkkkkkkkkk');
      const path = `${user.username}/post_images`;
      let formData = new FormData();
      formData.append("path", path);
      postImages.forEach((image) => {
        formData.append("file", image);
        console.log(image)
      });
      console.log(formData.values(),'poooooooo')
      const response = await uploadImages(formData, path, user.token);
      const res = await createPost(
        null,
        null,
        text,
        response,
        user.id,
        user.token
      );
      setLoading(false);
      if (res.status === "ok") {
        dispatch({ type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS", payload: [res.data, ...posts] });
        setText("");
        setImages([]);
        setVisible(false);
      } else {
        setError(res);
      }
    } else if (text.trim()) {
      setLoading(true);
      const res = await createPost(null, null, text, null, user.id, user.token);
      setLoading(false);
      if (res.status === "ok") {
        dispatch({ type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS", payload: [res.data, ...posts] });
        setText("");
        setVisible(false);
      } else {
        setError(res);
      }
    } else {
      console.log("type something bitch.");
    }
  };
  return (
    <div className="blur1">
      <div className="postBox" ref={popup}>
        {error && <PostError error={error} setError={setError} />}
        <div className="box_header">
          <div
            className="small_circle"
            onClick={() => {
              setVisible(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
          <img src={user?.picture} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name">
              {user.first_name} {user?.last_name}
            </div>
            <div className="box_privacy">
              <img src="../../../icons/public.png" alt="" />
              <span>Public</span>
              <i className="arrowDown_icon"></i>
            </div>
          </div>
        </div>

        {!showPrev ? (
          <>
            <EmojiPickerBackgrounds
              user={user}
              text={text}
              setText={setText}
              setBackground={setBackground}
              background={background}
            />
          </>
        ) : (
          <ImagePreview
            user={user}
            text={text}
            setText={setText}
            images={images}
            setImages={setImages}
            setShowPrev={setShowPrev}
            setError={setError}
          />
        )}
        <AddToYouPost setShowPrev={setShowPrev} />
        <button
          className="post_submit"
          onClick={() => postSubmit()}
          disabled={loading}
        >
          {loading ? (
            <PulseLoader
              size={5}
              color="#fff"
              loading={loading}
              aria-label="loading spinner"
              data-testid="loader"
            />
          ) : (
            "Post"
          )}
        </button>
      </div>
    </div>
  );
}
