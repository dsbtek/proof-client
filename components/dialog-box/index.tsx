import './dialog.css';

import { Modal, Button } from '@/components';

interface DialogBoxProps {
    title: string;
    content1: string;
    content2?: string;
    show: boolean;
    rejectText: string;
    acceptText: string;
    handleReject(): void;
    handleAccept(): void;
}

const DialogBox = ({ title, content1, content2, show, rejectText, acceptText, handleReject, handleAccept }: DialogBoxProps) => {
    return (
        <Modal show={show} onClose={() => { }}>
            <div className="dialog-box">
                <div className="dialog-box-header">
                    <h3>{title}</h3>
                </div>
                <div className="dialog-box-content">
                    <p>{content1}</p>
                    <br />
                    <p>{content2}</p>
                </div>
                <div className="dialog-box-footer">
                    <Button classname='decline-btn' onClick={handleReject}>{rejectText}</Button>
                    <Button classname='accepted-btn' onClick={handleAccept}>{acceptText}</Button>
                </div>
            </div>
        </Modal>
    )
};

export default DialogBox;