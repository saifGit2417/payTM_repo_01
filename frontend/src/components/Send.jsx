import React, { useState } from "react";
import styles from "../styles/Send.module.css";
import axios from "axios";
import { getAuthToken } from "../constants/helpers";

const SendModal = ({ open, handleClose, modalData }) => {
  const [amountToSent, setAmountToSent] = useState();

  const handleMoneyTransfer = () => {
    const toSend = modalData?._id;
    const bodyData = { to: toSend, amount: parseInt(amountToSent) };
    console.log("toSend: ", toSend);
    axios.post("http://localhost:8007/api/v1/account/transfer", bodyData, {
      headers: {
        Authorization: `Bearer ${getAuthToken}`,
      },
    });
  };
  return (
    <div>
      {open && (
        <div className={styles.modalBackdrop} onClick={handleClose}>
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>Send Money</h2>
            <div className={styles.modalContent}>
              <div>
                <div className={styles.friendName}>
                  <div className={styles.initialIcon}>
                    {modalData?.firstName.slice(0, 1)}
                  </div>
                  <p>Friends Name</p>
                </div>
                <p>Amount in (Rs)</p>
              </div>
              <div>
                <input
                  type="number"
                  value={amountToSent}
                  onChange={(e) => setAmountToSent(e.target.value)}
                />
              </div>
              <button
                disabled={amountToSent > 0 ? false : true}
                onClick={handleMoneyTransfer}
              >
                Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendModal;
