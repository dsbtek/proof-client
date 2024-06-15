
"use client"
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import './carousel.css';

interface CarouselProps {
    images: { url: string; title: string }[];
}

const ProofPassCarousel = ({ images }: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="proof-pass-carousel">
            <button onClick={handlePrevClick} className="carousel-button prev">Previous</button>
            <div className="proof-pass-carousel-content">
                <img src={images[currentIndex].url} alt={images[currentIndex].title} className="proof-pass-carousel-image" />
                <h4 className="proof-pass-carousel-title">{images[currentIndex].title}</h4>
            </div>
            <button onClick={handleNextClick} className="carousel-button next">Next</button>
        </div>
    );
};

export default ProofPassCarousel;
