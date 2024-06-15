import Image from "next/image";
import { FaRegCirclePlay } from "react-icons/fa6";

interface ListProps {
  imgUrl: string;
  title: string;
  onClick?: () => void;
}

const ListView = ({ imgUrl, title, onClick }: ListProps) => {
  return (
    <div className="list-card" onClick={onClick}>
      <Image className="card-img" src={imgUrl} alt="proof image" width={3000} height={3000} loading='lazy' />
      <div className="tut-text-wrap">
        <p className="tut-text">{title}</p>
        <FaRegCirclePlay color="#009CF9" size={30} />
      </div>
    </div>
  );
};

export default ListView;