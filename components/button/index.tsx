import React, { memo } from "react";
import Link from "next/link";

import "./button.css";

interface ButtonProps {
  blue?: boolean;
  white?: boolean;
  classname?: string;
  children:
    | string
    | React.JSX.Element
    | React.JSX.Element[]
    | (string | React.JSX.Element)[];
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  feature?: boolean;
  link?: string;
  style?: React.CSSProperties;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement> | any) => void;
}

const ButtonComponent = ({
  blue,
  white,
  classname,
  children,
  type = "button",
  disabled = false,
  link,
  style,
  onClick,
}: ButtonProps) => {
  const getButtonClassName = () => {
    if (blue) return "blue";
    if (white) return "white";
    return classname;
  };

  const buttonElement = (
    <button
      className={getButtonClassName()}
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );

  if (link) {
    return (
      <Link href={link} style={{ width: "100%", ...style }}>
        {buttonElement}
      </Link>
    );
  }

  return buttonElement;
};

const Button = memo(ButtonComponent);

export default Button;
