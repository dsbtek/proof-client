'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './imagePreviewModal.css';

interface ImagePreviewModalProps {
    images: string[];
    currentIndex: number;
    onClose?: () => void;
}

const ImagePreviewModal = ({ images, currentIndex, onClose }: ImagePreviewModalProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);

    useEffect(() => {
        setCurrentImageIndex(currentIndex);
    }, [currentIndex]);

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="image-preview-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <button className="prev-button" onClick={handlePrevious}>‹</button>
                <Image
                    src={images[currentImageIndex]}
                    alt={`Image ${currentImageIndex + 1}`}
                    width={500}
                    height={500}
                />
                <button className="next-button" onClick={handleNext}>›</button>
            </div>
        </div>
    );
};

export default ImagePreviewModal;
