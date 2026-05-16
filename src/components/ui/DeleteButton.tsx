"use client";

import { Button, Modal } from "@/components/ui/AntD";
import { useState } from "react";

interface DeleteButtonProps {
  onConfirm: () => void;
  itemName: string;
  warningText?: string;
  buttonText?: string;
}

export default function DeleteButton({
  onConfirm,
  itemName,
  warningText,
  buttonText = "Delete",
}: DeleteButtonProps) {
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
        onClick={showModal}
      >
        {buttonText} {itemName}
      </Button>

      <Modal
        title={`Remove ${itemName}`}
        open={isModalOpen}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Confirm Delete"
        okButtonProps={{ className: "neo-brutal-button neo-pressable neo-red", style: { border: "none" } }}
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
