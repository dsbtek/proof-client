import './checkbox.css';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: () => void;
}

const CheckBox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <div className={"checkbox-wrapper"}>
      <input id={label} type="checkbox" checked={checked} onChange={onChange} />
      {label && <label htmlFor={label}>{label}</label>}
    </div>
  );
};

export default CheckBox;