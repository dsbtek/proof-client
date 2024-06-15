// components/ImageDisplay.tsx

import Image from "next/image";
import { useState, useEffect } from "react";

interface ImageDisplayProps {
  imageId: string;
}

const ImageDisplay = ({ imageId }: ImageDisplayProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (imageId) {
      // Replace the below URL with the actual endpoint for fetching the image
      const url = `https://example.com/images/${imageId}`;
      setImageUrl(url);
    }
  }, [imageId]);

  if (!imageUrl) {
    return <p> Loading image... </p>;
  }

  return (
    <div>
      <h2>Chain of Custody</h2>
      <Image src={imageUrl} alt="Chain of Custody" width={600} height={400} />
    </div>
  );
};

export default ImageDisplay;
