import React from 'react';
import './date-selector.css';

interface DateSelectProps {
    className?: string;
    disabled?: boolean;
    placeholder: string;
    name: string;
    label: string;
    value: string;
    onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

const DateSelector = ({ className, disabled, placeholder, label, name, value, onChange }: DateSelectProps) => {
    return (
        <div className="dateSelector-wrap">
            <label htmlFor={name} className="text-sm font-medium">
                {label}
            </label>
            <input
                type="date"
                id={name}
                name={name}
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                className={className}
                onChange={onChange}
            />
        </div>
    );
};

export default DateSelector;
