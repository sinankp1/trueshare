import { Feeling, LiveVideo, Photo } from "../../svg";
import UserMenu from "../header/userMenu";
import "./style.css";
export default function CreatePost({ user, setVisible,profile }) {
  return (
    <div className="createPost" style={{width:`${profile ? "100%" : ""}`}}>
      <div className="createPost_header">
        <img src={user?.picture} alt="" />
        <div
          className="open_post hover2"
          onClick={() => {
            setVisible(true);
          }}
        >
          What's on your mind, {user?.first_name}
        </div>
      </div>
      <div className="create_splitter"></div>
      <div className="createPost_body">
        <div
          className="createPost_icon hover1"
          onClick={() => {
            setVisible(true);
          }}
        >
          <Photo color="#4bbf67" />
          Photo
        </div>
      </div>
    </div>
  );
}