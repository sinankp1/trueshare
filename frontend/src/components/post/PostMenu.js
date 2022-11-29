import { useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";
import useOnClickOutside from "../../helpers/clickOutSide";
import { deletePost, savePost } from "../../functions/post";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";

export default function PostMenu({
  postUserId,
  userId,
  imagesLength,
  setShowMenu,
  token,
  postId,
  checkSaved,
  setCheckSaved,
  images,
  postRef,
  menu,
}) {
  const [test, setTest] = useState(postUserId === userId ? true : false);
  useOnClickOutside(menu, () => setShowMenu(false));
  const saveHandler = async () => {
    savePost(postId, token);
    if (checkSaved) {
      setCheckSaved(false);
    } else {
      setCheckSaved(true);
    }
  };
  const downloadImages = async () => {
    images.map((img) => {
      saveAs(img.url, "image.jpg");
    });
  };
  const deleteHandler = async () => {
    const res = await deletePost(postId, token);
    if (res.status === "ok") {
      postRef.current.remove();
    }
  };
  return (
    <>
      <ul className="post_menu">
        <div onClick={() => saveHandler()}>
          {checkSaved ? (
            <MenuItem
              icon="save_icon"
              title="Unsave Post"
              subtitle="Remove this from your saved items."
            />
          ) : (
            <MenuItem
              icon="save_icon"
              title="Save Post"
              subtitle="Add this to your saved items."
            />
          )}
        </div>

        {imagesLength && (
          <div onClick={() => downloadImages()}>
            <MenuItem icon="download_icon" title="Download" />
          </div>
        )}
        {test && (
          <div onClick={() => deleteHandler()}>
            <MenuItem
              icon="trash_icon"
              title="Move to trash"
              subtitle="items in your trash are deleted after 30 days"
            />
          </div>
        )}
        {!test && <div className="line"></div>}
        {!test && (
          <Link to={`/reportPost/${postId}`} >
            <MenuItem
              img="../../../icons/report.png"
              title="Report post"
              subtitle="i'm concerned about this post"
            />
          </Link>
        )}
      </ul>
      
    </>
  );
}
