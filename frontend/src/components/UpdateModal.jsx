import * as React from "react";
import Box from "@mui/material/Box";
import styles from "../styles/signup.module.css";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../constants/helpers";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UpdateModal = ({ open, setOpen,onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const headers = {
    Authorization: `Bearer ${getAuthToken}`, // Example authorization header
    "Content-Type": "application/json", // Assuming your content type is JSON
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        "https://paytm100x.vercel.app/api/v1/user/updateExistingDetails",
        formData,
        { headers }
      )
      .then((response) => {
        setOpen(false);
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2>Update Details</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <p className={styles.disclaimer}>
              Change Of Mind <span onClick={onClose}>Cancel</span>{" "}
            </p>

            <button type="submit" className={styles.submitButton}>
              Update Details
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateModal;
