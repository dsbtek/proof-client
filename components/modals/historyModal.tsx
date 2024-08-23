"use client";

import { useEffect, useRef, useState } from "react";

import { Modal, Button } from "@/components";

interface SessionModalProps {
  show: boolean;
  onClose?: (a?: any) => void;
}

const HistoryModal = ({ show, onClose }: SessionModalProps) => {
  const [countdown, setCountdown] = useState<number>(30);
  const timerId = useRef<NodeJS.Timeout | undefined>();

  return (
    <Modal show={show} onClose={onClose}>
      <div className="session-modal">
        <h1 className="sm-text">You will automatically logout in:</h1>
        <h1 className="timer-text">{countdown}</h1>
        <Button white onClick={() => null}>
          Stay Logged In
        </Button>
      </div>
    </Modal>
  );
};

export default HistoryModal;
