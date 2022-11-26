import { useSelector } from "react-redux";
import "./style.css";
import Header from "../../components/header";
import CreatePost from "../../components/createPost";
import SendVerification from "../../components/home/sendVerification";
import { useEffect, useState } from "react";
import Post from "../../components/post";
import { useRef } from "react";

export default function Home({ posts, setVisible }) {
  const { user } = useSelector((state) => ({ ...state }));
  const middle = useRef(null);
  const [height, setHeight] = useState();
  useEffect(() => {
    setHeight(middle.current.clientHeight);
  }, [posts]);
  return (
    <div className="home" style={{ height: `${height}px` }}>
      {!user.verified && (
        <div className="blur1">
          <SendVerification user={user} />
        </div>
      )}
      <Header page="home" />
      <div className="home_middle" ref={middle}>
        <CreatePost user={user} setVisible={setVisible} />
        <div className="posts">
          {posts.map((post) => (
            <Post key={post._id} post={post} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
