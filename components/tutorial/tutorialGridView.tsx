import Image from 'next/image';
import { FaRegCirclePlay } from "react-icons/fa6";

interface GridViewrProps {
  imgUrl: string;
  title: string;
  onClick?: () => void;
}

const GridView = ({ imgUrl, title, onClick }: GridViewrProps) => {
  return (
    <div className="grid-card" onClick={onClick}>
      <div className='tut-overlay'>
        <FaRegCirclePlay color="#009CF9" size={40} />
      </div>
      <Image className="grid-img" src={imgUrl} alt="proof image" width={3000} height={3000} loading='lazy' />
      <p>{title}</p>
    </div>
  )
};
export default GridView;
