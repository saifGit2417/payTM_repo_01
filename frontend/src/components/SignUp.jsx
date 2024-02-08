// Signup.js
import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import styles from "../styles/signup.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { AuthTokenAtom } from "../atoms/atoms";

const Signup = () => {
  const navigate = useNavigate();
  const setAuthToken = useSetRecoilState(AuthTokenAtom);

  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [snackBar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://paytm100x.vercel.app/api/v1/user/signup", formData)
      .then((res) => {
        console.log("res: ", res);
        if (res.status === 200 || res.status === 201) {
          const authToken = res.data.token;
          localStorage.setItem("auth_token", authToken);
          setAuthToken(authToken);
          navigate("/dashboard");
          setSnackbar({
            open: true,
            message: "sign up successfully",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "something went wrong",
            severity: "danger",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setSnackbar({
          open: true,
          message: "something went wrong",
          severity: "danger",
        });
      });
  };

  const handleClose = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };
  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <h2>Sign Up</h2>
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
            <label htmlFor="userName">Email:</label>
            <input
              type="userName"
              id="userName"
              name="userName"
              value={formData.userName}
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
            Dont have an account ,{" "}
            <span onClick={() => navigate("/signin")}>Sign in?</span>{" "}
          </p>

          <button type="submit" className={styles.submitButton}>
            Sign Up
          </button>
        </form>
      </div>
      <Snackbar
        open={snackBar.open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackBar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Signup;
