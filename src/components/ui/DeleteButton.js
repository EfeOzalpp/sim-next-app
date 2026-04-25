"use client";

import { Button, Modal } from "@/components/ui/AntD";
import { useState } from "react";

export default function DeleteButton({
  onConfirm,
  itemName,
  warningText,
  buttonText = "Delete",
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleConfirm = () => {
    onConfirm();
    setIsModalOpen(false);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <Button
        type="button"
        onClick={showModal}
        style={{
          background: "#ff4d4f",
          color: "white",
        }}
      >
        {buttonText} {itemName}
      </Button>

      <Modal
        title={`Remove ${itemName}`}
        open={isModalOpen}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Confirm Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>
          <strong>
            Are you sure you want to remove this {itemName.toLowerCase()}?
          </strong>
        </p>
        {warningText && <p>{warningText}</p>}
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
