import "./readonlyinput.css";

interface ReadOnlyInputProps {
  label: string;
  value: string;
}

function ReadOnlyInput({ label, value }: ReadOnlyInputProps) {
  return (
    <div className="set-input">
      <label className="set-label" htmlFor={label}>
        {label}
      </label>
      <input
        id={label}
        type="text"
        value={value}
        readOnly
        className="app-input set-text"
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
}

export default ReadOnlyInput;
