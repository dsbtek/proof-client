import { TbAlertSquareRounded } from "react-icons/tb";

import './alert.css';

interface AlertProps {
    show: boolean;
}

export default function Alert({ show }: AlertProps) {
    return (
        <>
            {!show && (
                <div className='alert'>
                    <TbAlertSquareRounded color='f9d800' size={20} />
                    <p className='alert-text'>User not detected in frame</p>
                </div>
            )}
        </>
    )
};
