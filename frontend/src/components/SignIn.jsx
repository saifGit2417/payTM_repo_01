import React, { useEffect, useState } from "react";
import styles from "../styles/signin.module.css";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [snackBar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const handleClose = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((pre) => ({ ...pre, [name]: value }));
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8007/api/v1/user/signin", formData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          const authToken = res.data.token;
          localStorage.setItem("auth_token", authToken);
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
  return (
    <>
      <div>
        <div className={styles.container}>
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
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
              <span onClick={() => navigate("/signup")}>Sign up?</span>{" "}
            </p>
            <button type="submit" className={styles.signInButton}>
              Sign In
            </button>
          </form>
        </div>
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

export default SignIn;