import React from "react";
import styles from "../styles/Home.module.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <button
        className={styles.signupButton}
        onClick={() => navigate("/signup")}
      >
        Sign Up
      </button>
      <button
        className={styles.signinButton}
        onClick={() => navigate("/signin")}
      >
        Sign In
      </button>
    </div>
  );
};

export default Home;
