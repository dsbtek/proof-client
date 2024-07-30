'use client';

import React from 'react';
import Select, { StylesConfig, SingleValue } from 'react-select';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import './select.css';

interface Option {
    id: number;
    value: string;
    label: string;
}

interface SelectProps {
    className?: string;
    disabled?: boolean;
    link?: string;
    style?: React.CSSProperties;
    data: Option[];
    placeholder: string;
    name: string;
    value: Option | null;
    onChange: (selectedOption: SingleValue<Option>) => void;
}

const customStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
        ...base,
        border: '1px',
        boxShadow: '10px 10px 50px 0px #0000000D',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        color: '#0C1617',
        height: '60px',
        '&:hover': {
            cursor: 'pointer'
        },
        '&:focus': {
            outline: 'none',
            backgroundColor: '#fafafa',
        },
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: '#EAEAEA',
    }),
    placeholder: (base) => ({
        ...base,
        color: '#b0b0b0',
    }),
    singleValue: (base) => ({
        ...base,
        color: '#0C1617',
    }),
    menu: (base) => ({
        ...base,
        boxShadow: 'none',
        border: '2px solid rgba(234,238,245,1)',
        borderTop: 'none',
        borderRadius: '0 0 5px 5px',
        borderBottom: '2px solid rgba(234,238,245,1)',
        marginTop: '-8px',
    }),
};

const SelectComponent: React.FC<SelectProps> = ({
    className,
    disabled,
    link,
    style,
    data,
    placeholder,
    name,
    value,
    onChange,
}) => {
    return (
        <Select
            classNamePrefix="react-select"
            className={className}
            options={data}
            isDisabled={disabled}
            styles={customStyles}
            onChange={(selectedOption) => {
                onChange(selectedOption);
            }}
            placeholder={placeholder}
            value={value}
            components={{
                IndicatorSeparator: () => null,
                DropdownIndicator: ({ selectProps }) =>
                    selectProps.menuIsOpen ? <AiOutlineUp /> : <AiOutlineDown />,
            }}
            menuPlacement="auto"
            menuPosition="absolute"
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            menuShouldScrollIntoView={false}
        />
    );
};

export default SelectComponent;
