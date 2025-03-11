import React from "react";
import "./SearchInput.css"; // Assuming you're using CSS Modules or a global CSS file
import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  className,
}) => {
  return (
    <div className={`search-input-container && ${className}`}>
      <FiSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
