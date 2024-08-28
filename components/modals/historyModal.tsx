"use client";

import { useEffect, useRef, useState } from "react";

import { Modal, Button } from "@/components";
import Badge from "../badge";
import { SlClose } from "react-icons/sl";

interface SessionModalProps {
  show: boolean;
  onClose?: (a?: any) => void;
  data?: any;
}

const HistoryModal = ({ show, onClose, data }: SessionModalProps) => {
  const [countdown, setCountdown] = useState<number>(30);
  const timerId = useRef<NodeJS.Timeout | undefined>();

  const getNumberOfDays = (startDate: string | undefined) => {
    if (!startDate) return NaN;
    const startDateObject = new Date(startDate);
    const currentDate = new Date();
    const difference = currentDate.getTime() - startDateObject.getTime();
    const daysDifference = difference / (1000 * 60 * 60 * 24);
    return Math.floor(daysDifference);
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="history-modal">
        <div className="close-icon-row" onClick={onClose}>
          <SlClose
            size={30}
            style={{ float: "right" }}
            className="clickable-icon-hover"
          />
        </div>
        <h4 className="history-modal-title">{data?.ServiceType}</h4>
        <p className="history-modal-subtext">
          {` This service took place ${getNumberOfDays(
            data?.servicedate
          )} days ago`}
        </p>
        <Badge
          type={
            data?.DrugTestResultStatus
              ? data?.DrugTestResultStatus
              : "Inconclusive"
          }
          text={
            data?.DrugTestResultStatus
              ? data?.DrugTestResultStatus
              : "Inconclusive"
          }
        />
        <div className="history-modal-details">
          <div className="history-modal-details-row">
            <p>Donor/Participant ID:</p>
            <p>{data?.ParticipantID}</p>
          </div>
          <div className="history-modal-details-row">
            <p>Date of Service:</p>
            <p>{data?.servicedate}</p>
          </div>
          <div className="history-modal-details-row">
            <p>Identity:</p>
            <p>{data?.GovernmentPhotoID || "Not Applicable"}</p>
          </div>
          <div className="history-modal-details-row">
            <p>Collection:</p>
            <p>{data?.CollectionDesignation || "Not Applicable"}</p>
          </div>
        </div>
        <Button
          blue
          onClick={() => null}
          style={{ height: "51px", marginBottom: "32px" }}
        >
          Document Images
        </Button>

        <h4 className="history-modal-title">PROOFpass</h4>
        <p className="history-modal-subtext">proof@recoverytrek.com</p>
      </div>
    </Modal>
  );
};

export default HistoryModal;
