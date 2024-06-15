"use client";

import { useState, ChangeEvent } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

import './textField.css';

interface InputProps {
    name: string;
    type: string;
    placeholder: string;
    value: number | string;
    startIcon?: React.ReactNode;
    endIcon?: boolean;
    errors: string | null;
    touched: boolean;
    readonly?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const TextInput = ({
    type,
    placeholder,
    value,
    startIcon,
    endIcon,
    name,
    errors,
    touched,
    readonly,
    onChange
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <div>
            <div className={`input-container ${isFocused ? "focused" : ""}`}>
                <label className="placeholder" htmlFor={name}>
                    {isFocused ? placeholder.toUpperCase() : ""}
                </label>
                {startIcon && <div className="icon start-icon">{startIcon}</div>}
                <input
                    className="app-input"
                    id={name}
                    name={name}
                    type={showPassword ? "text" : type}
                    placeholder={isFocused ? "" : placeholder.toUpperCase()}
                    value={value}
                    style={{
                        paddingLeft: startIcon ? "30px" : undefined,
                        paddingRight: endIcon ? "30px" : undefined,
                    }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    readOnly={readonly}
                    autoComplete="true"
                    onChange={onChange}
                />
                {endIcon && (
                    <div className="icon end-icon" onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <FaRegEyeSlash color="#009cf9" size={20} /> : <FaRegEye color="#009cf9" size={20} />}
                    </div>
                )}
            </div>
            {errors && touched && <p className="error">{errors}</p>}
        </div>
    );
};

export default TextInput;
