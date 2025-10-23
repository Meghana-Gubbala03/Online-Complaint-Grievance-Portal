import React from "react";
import "./Modal.css";

export default function Modal({ title, children, onClose, onConfirm, confirmText = "Confirm", cancelText = "Cancel" }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <div className="modal-content">{children}</div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>{cancelText}</button>
          <button className="btn-escalate" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
