import { Link } from "react-router-dom";
import "./style.css";
import Moment from "react-moment";
import { Dots, Public } from "../../svg";
import ReactsPopup from "./ReactsPopup";
import { useState, useEffect, useRef } from "react";
import CreateComment from "./CreateComment";
import Comment from "./Comment";
import { getReacts, reactPost } from "../../functions/post";
import PostMenu from "./PostMenu";
export default function Post({ post, user }) {
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const commentInput = useRef(null);
  const postRef = useRef(null);
  const menu = useRef(null);
  const [reacts, setReacts] = useState([]);
  const [check, setCheck] = useState();
  const [total, setTotal] = useState(0);
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(1);
  const [checkSaved, setCheckSaved] = useState();

  useEffect(() => {
    setComments(post?.comments);
  }, [post]);
  useEffect(() => {
    getPostReacts();
  }, [post]);
  const getPostReacts = async () => {
    const res = await getReacts(post._id, user.token);
    setReacts(res.reacts);
    setCheck(res.check);
    setTotal(res.total);
    setCheckSaved(res.checkSaved)
  };
  const reactHandler = async (type) => {
    reactPost(post._id, type, user.token);
    if (check == type) {
      setCheck();
      let index = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        let newReacts = reacts.map((element, i) =>
          i == index ? { ...element, count: --element.count } : element
        );
        setReacts(newReacts);
        setTotal((prev) => --prev);
      }
    } else {
      setCheck(type);
      let index = reacts.findIndex((x) => x.react == type);
      let index1 = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        // setReacts([...reacts, (reacts[index].count = 6)]);
        let newReacts = reacts.map((element, i) =>
          i == index ? { ...element, count: ++element.count } : element
        );
        setReacts(newReacts);
        setTotal((prev) => ++prev);
      }
      if (index1 !== -1) {
        let newReacts = reacts.map((element, i) =>
          i == index1 ? { ...element, count: --element.count } : element
        );
        setReacts(newReacts);
        // setReacts([...reacts, (reacts[index1].count = 7)]);
        setTotal((prev) => --prev);
      }
    }
  };
  const showMore = () => {
    setCount((prev) => prev + 3);
  };
  return (
    <>
    <div className="post" ref={postRef}>
      <div className="post_header">
        <Link to={`profile/${post.user.username}`} className="post_header_left">
          <img src={post.user.picture} alt="" />
          <div className="header_col">
            <div className="post_profile_name">
              {post.user.first_name} {post.user.last_name}
              <div className="updated_p">
                {post.type === "profilePicture" &&
                  `updated ${
                    post.user.gender === "male" ? "his" : "her"
                  } profile picture`}
                {post.type === "cover" &&
                  `updated ${
                    post.user.gender === "male" ? "his" : "her"
                  } cover photo`}
              </div>
            </div>
            <div className="post_profile_privacy_date">
              <Moment fromNow interval={30}>
                {post.createdAt}
              </Moment>
              . <Public color={"#828387"} />
            </div>
          </div>
        </Link>
        <div
          className="post_header_right hover1"
          onClick={() => {
            setShowMenu(true);
          }}
          ref={menu}
        >
          <Dots color="#828387" />
          {showMenu && (
            <PostMenu
              userId={user.id}
              postUserId={post.user._id}
              imagesLength={post?.images?.length}
              setShowMenu={setShowMenu}
              postId={post._id}
              token={user.token}
              checkSaved={checkSaved}
              setCheckSaved={setCheckSaved}
              images={post?.images}
              menu={menu}
              postRef={postRef}
            />
          )}
        </div>
      </div>
      {post.background ? (
        <div
          className="post_bg"
          style={{ backgroundImage: `url(${post.background})` }}
        >
          <div className="post_bg_text">{post.text}</div>
        </div>
      ) : (
        <>
          <div className="post_text">{post.text}</div>
          {post.images && post.images.length && (
            <div
              className={
                post.images.length === 1
                  ? "grid_1"
                  : post.images.length === 2
                  ? "grid_2"
                  : post.images.length === 3
                  ? "grid_3"
                  : post.images.length === 4
                  ? "grid_4"
                  : post.images.length >= 5 && "grid_5"
              }
            >
              {post.images.slice(0, 5).map((image, i) => (
                <img src={image.url} key={i} alt="" className={`img-${i}`} />
              ))}
              {post.images.length > 5 && (
                <div className="more-pics-shadow">
                  +{post.images.length - 5}
                </div>
              )}
            </div>
          )}
        </>
      )}
      <div className="post_infos">
        <div className="reacts_count">
          <div className="reacts_count_imgs">
            {reacts &&
              reacts
                .sort((a, b) => {
                  return b.count - a.count;
                })
                .slice(0, 3)
                .map(
                  (react, i) =>
                    react.count > 0 && (
                      <img
                        src={`../../../reacts/${react.react}.svg`}
                        alt=""
                        key={i}
                      />
                    )
                )}
          </div>
          <div className="reacts_count_num">{total ? total : ""}</div>
        </div>
        <div className="to_right">
          <div className="comments_count">{comments?.length} comments</div>
        </div>
      </div>
      <div className="post_actions">
        <ReactsPopup
          visible={visible}
          setVisible={setVisible}
          reactHandler={reactHandler}
        />
        <div
          className="post_action hover1"
          onMouseOver={() => {
            setTimeout(() => {
              setVisible(true);
            }, 500);
          }}
          onMouseLeave={() => {
            setTimeout(() => {
              setVisible(false);
            }, 500);
          }}
          onClick={() => reactHandler(check ? check : "like")}
        >
          {check ? (
            <img
              src={`../../../reacts/${check}.svg`}
              alt=""
              className="small_react"
              style={{ width: "20px" }}
            />
          ) : (
            <i className="like_icon"></i>
          )}
          <span
            style={{
              color: `${
                check === "like"
                  ? "#4267b2"
                  : check === "love"
                  ? "#f63459"
                  : check === "haha"
                  ? "#f7b125"
                  : check === "sad"
                  ? "#f7b125"
                  : check === "wow"
                  ? "#f7b125"
                  : check === "angry"
                  ? "#e4605a"
                  : ""
              }`,
            }}
          >
            {check ? check : "Like"}
          </span>
        </div>
        <div
          className="post_action hover1"
          onClick={() => {
            commentInput.current.focus();
          }}
        >
          <i className="comment_icon"></i>
          <span>Comment</span>
        </div>
      </div>
      <div className="comments_wrap">
        <div className="comments_order"></div>
        <CreateComment
          user={user}
          postId={post._id}
          setComments={setComments}
          setCount={setCount}
          textRef={commentInput}
        />
        {comments &&
          comments
            .sort((a, b) => {
              return new Date(b.commentAt) - new Date(a.commentAt);
            })
            .slice(0, count)
            .map((comment, i) => <Comment comment={comment} key={i} />)}
        {count > 1 && (
          <div
            className="view_comments"
            onClick={() => {
              setCount(1);
            }}
          >
            Show less
          </div>
        )}
        {count < comments.length && (
          <div
            className="view_comments"
            onClick={() => {
              showMore();
            }}
          >
            View more comments
          </div>
        )}
      </div>
    </div>
    </>
  );
}
