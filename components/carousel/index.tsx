"use client";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "./carousel.css";
import { welcomeData } from "@/utils/appData";
import CarouselCard from "@/components/carousel-card";

function Carousel() {
  const [idx, setIndex] = useState(0);

  const handleLeftClick = () => {
    if (idx === 0) {
      setIndex(welcomeData.length - 1);
    } else {
      setIndex(idx - 1);
    }
  };
  const handleRightClick = () => {
    if (idx === welcomeData.length - 1) {
      setIndex(0);
    } else {
      setIndex(idx + 1);
    }
  };
  return (
    <div className="carousel">
      {welcomeData.map(
        (data, index) =>
          index === idx && (
            <CarouselCard
              key={index}
              image={data.imgUri}
              title={data.title}
              texts={data.texts}
            />
          )
      )}
      <div className="pagination">
        <button className="page-btn" onClick={handleLeftClick}>
          <IoIosArrowBack size={16} />
        </button>
        {welcomeData.map((_, index) => (
          <div
            className={idx === index ? "active-dot" : "dot"}
            key={index}
            onClick={() => setIndex(index)}
          >
            {""}
          </div>
        ))}
        <button className="page-btn" onClick={handleRightClick}>
          <IoIosArrowForward size={16} />
        </button>
      </div>
    </div>
  );
}

export default Carousel;
