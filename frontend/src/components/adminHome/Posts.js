import { useSelector } from "react-redux";
import { getAllPosts } from "../../functions/admin";
import { postsReducer } from "../../functions/reducer";
import { useEffect, useReducer } from "react";
import DataTable from "react-data-table-component";
import { AdminDeletePost, adminDeletePost } from "../../functions/post";
import { useState } from "react";
export default function Posts({home}) {
  const [{ loading, posts, error }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });
  const [confirmPopup, setConfirmPopup] = useState("");
  const { admin } = useSelector((state) => ({ ...state }));
  const getAllPostss = async () => {
    dispatch({ type: "POSTS_REQUEST" });
    const response = await getAllPosts(admin.token);
    if (response.status === "ok") {
      dispatch({ type: "POSTS_SUCCESS", payload: response.data });
    } else {
      dispatch({ type: "POSTS_ERROR", payload: response.data });
    }
  };
  useEffect(() => {
    getAllPostss();
  }, []);

  const removeHandler = async () => {
    const res = await AdminDeletePost(confirmPopup, admin.token);
    getAllPostss();
    setConfirmPopup("");
  };
  const columns = [
    {
      name: "Username",
      selector: (row) => row.user.username,
      sortable: true,
    },
    {
      name: "Text",
      selector: (row) => row.text,
    },
    {
      name: "Images",
      selector: (row) =>
        row.images &&
        row.images.length && (
          <div
            style={{
              display: "flex",
              maxWidth: "130px",
              gap: "5px",
              flexWrap: "wrap",
            }}
          >
            {row.images.map((img, i) => (
              <img
                src={img.url}
                key={i}
                style={{ width: "60px", objectFit:"contain" }}
              />
            ))}
          </div>
        ),
    },
    {
      name: "Reports",
      selector: (row) => (row.reports ? row.reports.length : "0"),
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => {
        return new Date(row.createdAt).toLocaleDateString();
      },
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.removed ? (
          "Removed"
        ) : row.reports.length > 0 ? (
          <button
            className="removePost"
            onClick={() => {
              setConfirmPopup(row._id);
            }}
          >
            Remove
          </button>
        ) : (
          "Active"
        ),
      sortable: true,
    },
  ];
  return (
    <>
      <DataTable
        columns={columns}
        data={home ? posts.slice(0,5):posts}
        title="Posts"
        pagination={!home}
        persistTableHead
      />
      {confirmPopup && (
        <div className="blur1">
          <div className="confirm_popup">
            <div className="c_header">
              Confirm
              <div className="small_circle" onClick={() => setConfirmPopup("")}>
                <i className="exit_icon"></i>
              </div>
            </div>
            <div className="c_body">
              Please confirm your action.
              <button className="blue_btn" onClick={removeHandler}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
