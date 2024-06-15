import './checkbox.css';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <div className={"checkbox-wrapper"}>
      {/* Assign onChange handler */}
      <input id={label} type="checkbox" checked={checked} onChange={onChange} />
      {label && <label htmlFor={label}>{label}</label>}
    </div>
  );
};

export default Checkbox;