import { useEffect, useMemo } from "react";
import { useReducer } from "react";
import { useSelector } from "react-redux";
import { getAllUsers, blockUser as block } from "../../functions/admin";
import { usersReducer } from "../../functions/reducer";
import DataTable from "react-data-table-component";
import { useState } from "react";

export default function Users() {
  const { admin } = useSelector((state) => ({ ...state }));
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [blockUser, setBlockUser] = useState({});
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [{ loading, users, error }, dispatch] = useReducer(usersReducer, {
    loading: false,
    users: [],
    error: "",
  });
  const filteredItems = users.filter(
    (user) =>
      user.username &&
      user.username.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <div className="filterUser">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button className="blue_btn" onClick={handleClear}>
          clear
        </button>
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const getAllUserss = async () => {
    dispatch({
      type: "USERS_REQUEST",
    });
    const res = await getAllUsers(admin.token);
    if (res.status === "ok") {
      dispatch({
        type: "USERS_SUCCESS",
        payload: res.data,
      });
    } else {
      dispatch({
        type: "USERS_ERROR",
        payload: res.data,
      });
    }
  };
  const blockHander = async (id, status, username) => {
    try {
      setBlockUser({ id, status, username });
      setConfirmPopup(true);
    } catch (error) {}
  };
  const blockUserHandler = async () => {
    const response = await block(blockUser.id, admin.token);
    setConfirmPopup(false);
    if (response.status === "ok") {
      dispatch({
        type: "USERS_SUCCESS",
        payload: response.data,
      });
    } else {
      dispatch({
        type: "USERS_ERROR",
        payload: response.data,
      });
    }
  };
  useEffect(() => {
    getAllUserss();
  }, []);
  console.log(blockUser);
  const columns = [
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
    },
    {
      name: "Verified",
      selector: (row) => (row.verified ? "Verfied" : "Not Verified"),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.status ? (
          <button
            className="blue_btn"
            onClick={() => {
              blockHander(row._id, row.status, row.username);
            }}
          >
            {"Block"}
          </button>
        ) : (
          <button
            className="blue_btn"
            onClick={() => {
              blockHander(row._id, row.status, row.username);
            }}
          >
            {"Unblock"}
          </button>
        ),
      sortable: true,
    },
  ];
  return (
    <>
      <DataTable
        columns={columns}
        data={filteredItems}
        title="Users"
        pagination
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />
      {confirmPopup && (
        <div className="blur1">
          <div className="confirm_popup">
            <div className="c_header">
              Confirm
              <div
                className="small_circle"
                onClick={() => setConfirmPopup(false)}
              >
                <i className="exit_icon"></i>
              </div>
            </div>
            <div className="c_body">
              {blockUser.status ? "Block" : "Unblock"} user {blockUser.username}
              ?
              <button className="blue_btn" onClick={blockUserHandler}>
                {blockUser.status ? "Block" : "Unblock"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <table className="user_table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Verified</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user, i) => (
              <tr key={i}>
                <td>{i}</td>
                <td>{user.username}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.gender}</td>
                <td>{user.verified ? "Verified" : "Not verified"}</td>
                <td>
                  {user.status ? (
                    <button className="blue_btn" style={{ background: "red" }}>
                      block
                    </button>
                  ) : (
                    <button
                      className="blue_btn"
                      style={{ background: "green" }}
                    >
                      unblock
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table> */}
    </>
  );
}
