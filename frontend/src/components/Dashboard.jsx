import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Send from "./Send";
import styles from "../styles/Dashboard.module.css";
import { getAuthToken } from "../constants/helpers";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");
  const [allUserDetails, setAlUserDetails] = useState([]);
  const [openModal, setOpenModal] = useState({
    open: false,
    modalData: {},
  });
  const decodeToken = jwtDecode(getAuthToken);
  const loggedInUserId = decodeToken?.userId;

  const fetchUserDetails = (filterVal = "") => {
    let apiUrl = `http://localhost:8007/api/v1/user/user/bulk`;
    if (filterVal) {
      apiUrl += `?filter=${filterVal}`;
    }
    axios
      .get(apiUrl, {
        authorization: `Bearer ${getAuthToken}`,
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          // logged in user should not be in the list of users to whom money can be sent
          let listOfAllUsers = res?.data?.user;
          let filterOutList =
            listOfAllUsers &&
            listOfAllUsers?.filter((data) => data._id !== loggedInUserId);
          setAlUserDetails(filterOutList);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (searchVal) {
      let timerApi = setTimeout(() => {
        fetchUserDetails(searchVal);
      }, 2000);
      return () => clearTimeout(timerApi);
    } else {
      fetchUserDetails(searchVal);
    }
  }, [searchVal]);

  const handleOpenModal = (data) => {
    setOpenModal((prev) => ({ ...prev, open: true, modalData: data }));
  };

  const handleCloseModal = () => {
    setOpenModal((prev) => ({ ...prev, open: true, modalData: {} }));
  };
  const handleLogout = () => {
    navigate("/signin");
    localStorage.clear();
  };
  return (
    <div>
      <div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div>
        <h1>Payments App</h1>
        <div>
          <p>Hello User</p>
        </div>
      </div>
      <div>
        <h1>Your Balance</h1>
      </div>
      <div>
        <h1>Users</h1>
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </div>
      <div>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>User Name</th>
              <th>Initial</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allUserDetails.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className={styles.initialIcon}>
                    {user.firstName.slice(0, 1)}
                  </div>
                </td>
                <td>{user.firstName}</td>
                <td>{user.userName}</td>
                <td>
                  <button
                    className={styles.actionButton}
                    onClick={(e) => handleOpenModal(user)}
                  >
                    Send Money
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openModal && (
        <Send
          open={openModal.open}
          handleClose={handleCloseModal}
          modalData={openModal.modalData}
        />
      )}
    </div>
  );
};

export default Dashboard;
