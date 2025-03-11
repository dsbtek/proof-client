export const unmirrorBase64Image = (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create a new image element
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      // Create a canvas to manipulate the image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Flip the canvas horizontally (scaleX(-1) to mirror horizontally)
      ctx?.translate(img.width, 0);
      ctx?.scale(-1, 1);

      // Draw the image onto the flipped canvas
      ctx?.drawImage(img, 0, 0, img.width, img.height);

      // Convert the canvas back to a base64 string
      const unmirroredBase64 = canvas.toDataURL();

      // Resolve the promise with the unmirrored base64 image
      resolve(unmirroredBase64);
    };

    img.onerror = (error) => {
      // Reject the promise if the image fails to load
      reject(error);
    };
  });
};
