import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Send from "./Send";
import styles from "../styles/Dashboard.module.css";
import { getAuthToken } from "../constants/helpers";
import { useSetRecoilState } from "recoil";
import { AuthTokenAtom } from "../atoms/atoms";
import UpdateModal from "./UpdateModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const setAuthToken = useSetRecoilState(AuthTokenAtom);
  const [searchVal, setSearchVal] = useState("");
  const [allUserDetails, setAlUserDetails] = useState([]);
  const [loginUserName, setLoginUserName] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [updateModal, setUpdateModal] = useState(false);
  const decodeToken = jwtDecode(getAuthToken);
  const loggedInUserId = decodeToken?.userId;

  const fetchUserDetails = (filterVal = "") => {
    let apiUrl = `https://paytm100x.vercel.app/api/v1/user/user/bulk`;
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

          let loggedInUserData =
            listOfAllUsers &&
            listOfAllUsers?.filter((data) => data._id === loggedInUserId);

          setLoginUserName(loggedInUserData[0]);
          setAlUserDetails(filterOutList);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchUserBalance = () => {
    try {
      axios
        .get("https://paytm100x.vercel.app/api/v1/account/balance", {
          headers: {
            Authorization: `Bearer ${getAuthToken}`,
          },
        })
        .then((res) => {
          const userBalance = res.data.balance;
          setUserBalance(userBalance);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (searchVal) {
      let timerApi = setTimeout(() => {
        fetchUserDetails(searchVal);
      }, 1000);
      return () => clearTimeout(timerApi);
    } else {
      fetchUserDetails(searchVal);
    }
  }, [searchVal, updateModal]);

  useEffect(() => {
    fetchUserBalance();
  }, [openModal]);

  const handleOpenModal = (data) => {
    setOpenModal(true);
    setModalData(data);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalData({});
    setUpdateModal(false);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
    setAuthToken(null);
  };

  const handleOpenUpdateModal = () => {
    setUpdateModal(true);
  };
  return (
    <div>
      <div className={styles.actionBtns}>
        <button
          className={`${styles.logoutButton} ${styles.logout}`}
          onClick={handleLogout}
        >
          Logout
        </button>
        <div>
          {" "}
          <button
            className={`${styles.logoutButton} ${styles.update}`}
            onClick={handleOpenUpdateModal}
          >
            Update Profile
          </button>
        </div>
      </div>
      <div>
        <h1>Payments App</h1>
        <div>
          <p>
            Hello{" "}
            {loginUserName &&
              loginUserName?.firstName + " " + loginUserName?.lastName}{" "}
          </p>
        </div>
      </div>
      <div>
        <h1>Your Balance {userBalance} </h1>
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
              <th>Initials</th>
              <th>User Name</th>
              <th>Email</th>
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
          open={openModal}
          setOpen={setOpenModal}
          modalData={modalData}
          setModalData={setModalData}
          onClose={handleCloseModal}
        />
      )}
      {updateModal && (
        <UpdateModal
          open={updateModal}
          setOpen={setUpdateModal}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
