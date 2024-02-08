import React, { useState } from "react";
import styles from "../styles/Send.module.css";
import axios from "axios";
import { getAuthToken } from "../constants/helpers";

const SendModal = ({ open, handleClose, modalData }) => {
  const [amountToSent, setAmountToSent] = useState();
  const onClose = () => {
    handleClose();
  };
  const handleMoneyTransfer = () => {
    const toSend = modalData?._id;
    const bodyData = { to: toSend, amount: parseInt(amountToSent) };
    axios
      .post("https://paytm100x.vercel.app/api/v1/account/transfer", bodyData, {
        headers: {
          Authorization: `Bearer ${getAuthToken}`,
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setOpenModal({ open: false, modalData: {} });
          onClose();
        }
      })
      .catch((err) => {
        onClose();
        console.log("err: ", err);
      });
  };

  return (
    <div>
      {open && (
        <div className={styles.modalBackdrop} onClick={onClose}>
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>Send Money</h2>
            <div className={styles.modalContent}>
              <div>
                <div className={styles.friendName}>
                  <div className={styles.initialIcon}>
                    {modalData?.firstName?.slice(0, 1)}
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
