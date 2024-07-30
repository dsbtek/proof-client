import './headerText.css'

interface HeaderTextProps {
    title: string;
    text: string;
}

function HeaderText({ title, text }: HeaderTextProps) {
    return (
        <div className="header-text">
            <p className="title">{title}</p>
            <p className="text">{text}</p>
        </div>
    )
};

export default HeaderText;