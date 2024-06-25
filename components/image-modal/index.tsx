"use client"
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import './modal.css';
import { Button, ImagePreviewModal, Loader_ } from '..';

interface ProofPassUploadType {
  isOpen: boolean;
  onClose: () => void;
  imageUrls: string[];
  imageNames: string[];
}

const ImageModal = ({ isOpen, onClose, imageUrls, imageNames }: ProofPassUploadType) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formatImagesToBase64, setFormatImagesToBase64] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<boolean[]>([]);
  const [fileShare, setFileShare] = useState(false);

  useEffect(() => {
    const base64Images = imageUrls.map(image => `data:image/png;base64,${image}`);
    setFormatImagesToBase64(base64Images);
    setSelectedImages(new Array(imageUrls.length).fill(false));
  }, [imageNames, imageUrls]);

  if (!isOpen) return null;

  const handlePreview = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleImageSelection = (index: number) => {
    const updatedSelection = [...selectedImages];
    updatedSelection[index] = !updatedSelection[index];
    setSelectedImages(updatedSelection);
  };

  const handleShareSelectedImages = () => {
    const selectedImageUrls = imageUrls.filter((_, index) => selectedImages[index]);
    const formattedImageUrls = selectedImageUrls.map(img => `data:image/png;base64,${img}`);
    const emailBody = `
      <p>Check out these images:</p>
      ${formattedImageUrls.map((img, index) => `<div><img src="${img}" alt="Image ${index + 1}" style="max-width: 100%; height: auto;"/></div>`).join('<br/>')}
    `;
    window.location.href = `mailto:?subject=Shared Images&body=${encodeURIComponent(emailBody)}`;
  };

  const handleUnshare = () => {
    setFileShare(false);
    setSelectedImages(new Array(imageUrls.length).fill(false));
  };

  return (
    <div className='modalOverlay' onClick={onClose}>
      {imageUrls.length > 0 ? (
        <div className='modal-wrap'>
          <div className="btn-doc-share-wrap" onClick={e => e.stopPropagation()}>
            {!fileShare && <Button classname='btn-share' onClick={() => { setFileShare(true) }}>Share</Button>}
            {fileShare && <Button classname='btn-unshare' onClick={handleUnshare}>Unshare</Button>}
            {fileShare && <Button classname='btn-send' onClick={handleShareSelectedImages}>Send</Button>}
          </div>

          <div className='modal-Content'>
            {imageUrls.map((img, index) => (
              <div className='modal-thumbnail' key={index} onClick={e => e.stopPropagation()}>
                {fileShare &&
                  <div className="checkbox-wrapper_">
                    <input
                      type="checkbox"
                      checked={selectedImages[index]}
                      onChange={() => toggleImageSelection(index)}
                    />
                    <div className="custom-checkbox_"></div>
                  </div>
                }
                <Image
                  src={`data:image/png;base64,${img}`}
                  width={100}
                  height={100}
                  alt="Document Image"
                  className='modalImage'
                />
                <div className="modal-thumbnail-overlay">
                  <Button classname='modal-thumbnail-overlay-btn-view' onClick={() => handlePreview(index)}>View</Button>
                  <br />
                  <p style={{ color: 'white', textAlign: 'center' }}>{imageNames[index].replace('.jpeg', '')}</p>
                </div>
              </div>
            ))}
            {isModalOpen && (
              <ImagePreviewModal
                images={formatImagesToBase64}
                currentIndex={currentIndex}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </div>
      ) : (
        <Loader_ />
      )}
    </div>
  );
};

export default ImageModal;
