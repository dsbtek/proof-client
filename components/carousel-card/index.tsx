import Image from "next/image";

import "./carousel-card.css";

interface CaroselCardProps {
  image: string;
  title: string;
  texts: string[];
}

function CarouselCard({ image, title, texts }: CaroselCardProps) {
  return (
    <div className="carousel-card">
      <div>
        <Image
          className="cc-image"
          src={image}
          alt="image"
          width={3000}
          height={3000}
          priority
        />
      </div>
      <div className="cc-content">
        <h3 className="cc-title">{title}</h3>
        {texts.map((text, index) => (
          <p key={index} className="cc-text">
            {/* {index + 1 + "."} */}
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default CarouselCard;
