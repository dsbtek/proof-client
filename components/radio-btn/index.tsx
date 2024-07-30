import React from 'react';
import './radio.css';

interface RadioBtnProps {
  label?: string;
  checked: boolean;
  onChange: () => void;
}

const RadioButton = ({ onChange, checked, label }: RadioBtnProps) => {
  return (
    <div className="radio-button">
      <label>
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
        />
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
