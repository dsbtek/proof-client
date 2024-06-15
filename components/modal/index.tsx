import './modal.css';
interface ModalProps {
    children: JSX.Element | JSX.Element[];
    show: boolean;
    onClose?: () => void;
}

const Modal = ({ children, show, onClose }: ModalProps) => {
    return (
        <>
            {show && (
                <div className='modal' onClick={onClose}>
                    {children}
                </div>
            )}
        </>
    )
};

export default Modal;