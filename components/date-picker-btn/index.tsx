import React, { forwardRef } from 'react';
import { AiOutlineRight } from 'react-icons/ai';
import styles from './Button.module.css';

interface ButtonProps {
    onClick: () => void;
    classname?: string;
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ onClick, classname, children }, ref) => (
    <button ref={ref} onClick={onClick} className={`${styles.button} ${classname}`}>
        {children}
    </button>
));

Button.displayName = 'Button';

export default Button;