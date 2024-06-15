'use client';

import { useState } from 'react';
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
    dropdownIndicator: (base) => ({
        ...base,
        color: '#333',
    }),
};

const CustomSeparator = () => (
    <div
        style={{
            margin: '4px 0',
            borderBottom: '1px solid #ccc',
        }}
    />
);

const SelectComponent = ({
    className,
    disabled,
    link,
    style,
    data,
    placeholder,
    name,
    value,
    onChange,
}: SelectProps) => {
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    return (
        <Select
            className={className}
            options={data}
            isDisabled={disabled}
            styles={customStyles}
            menuIsOpen={menuIsOpen}
            onMenuOpen={() => setMenuIsOpen(true)}
            onMenuClose={() => setMenuIsOpen(false)}
            onChange={onChange}
            placeholder={placeholder}
            value={value}
            components={{
                IndicatorSeparator: () => null,
                DropdownIndicator: () => (menuIsOpen ? <AiOutlineUp /> : <AiOutlineDown />),
                MenuList: ({ children }) => (
                    <div>
                        {children}
                        <CustomSeparator />
                    </div>
                ),
            }}
            menuPlacement="auto"
            menuPosition="absolute"
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            menuShouldScrollIntoView={false}
        />
    );
};

export default SelectComponent;
