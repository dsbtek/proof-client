import React from 'react';
import Link from 'next/link';

import './button.css';

interface ButtonProps {
    blue?: boolean;
    white?: boolean;
    classname?: string;
    children: string | React.JSX.Element | React.JSX.Element[] | (string | React.JSX.Element)[];
    type?: 'submit' | 'reset';
    disabled?: boolean;
    feature?: boolean;
    link?: string;
    style?: React.CSSProperties;
    onClick?: (e?: any) => void;
}


const Button = ({ blue, white, classname, children, type, disabled, link, style, onClick }: ButtonProps) => {
    return (
        link ? (<Link href={link} style={{ width: '100%', ...style }}>
            <button className={blue ? 'blue' : white ? 'white' : classname}
                type={type ? type : 'button'}
                disabled={disabled ? disabled : false}
                onClick={onClick ? onClick : undefined}
            >
                {children}
            </button>
        </Link>) : (
            <button className={blue ? 'blue' : white ? 'white' : classname}
                type={type ? type : 'button'}
                disabled={disabled ? disabled : false}
                onClick={onClick ? onClick : undefined}
                style={style}
            >
                {children}
            </button>
        ));
};

export default Button;