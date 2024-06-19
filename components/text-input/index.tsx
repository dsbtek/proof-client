import './text-input.css';

interface TextInputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

const TextAreaField = ({ value, onChange, placeholder }: TextInputProps) => {
    return (
        <div className="text-input">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={4}  // You can adjust the number of rows as needed
            />
        </div>
    );
};

export default TextAreaField;
