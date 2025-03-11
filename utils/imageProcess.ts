// Function to sharpen the image by applying grayscale and unsharp mask
export const sharpenImage = (base64Image: string) => {
  return new Promise((resolve, reject) => {
    console.log("sharpening started");
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx?.drawImage(img, 0, 0);

      // Convert the image to grayscale first
      applyGrayscale(ctx!, canvas.width, canvas.height);

      // Apply Unsharp Mask for sharpening (grayscale)
      applyUnsharpMask(ctx!, canvas.width, canvas.height);

      // Apply a second pass of sharpening (for even more sharpness)
      applyUnsharpMask(ctx!, canvas.width, canvas.height);

      // Convert the canvas to base64 string
      const sharpenedBase64 = canvas.toDataURL();
      resolve(sharpenedBase64);
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
};

// Function to convert the image to grayscale
const applyGrayscale = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert to grayscale using the luminance formula
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Set the grayscale value for all channels (R, G, B)
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  // Put the grayscale image data back to the canvas
  ctx.putImageData(imageData, 0, 0);
};

// Function to apply Unsharp Mask (sharpening technique) to the grayscale image
const applyUnsharpMask = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Create a blurred version of the image (Gaussian blur)
  const blurredData = gaussianBlur(imageData, width, height);

  // Subtract the blurred image from the original (Unsharp Mask)
  for (let i = 0; i < data.length; i += 4) {
    // Get the original pixel value
    const gray = data[i];

    // Get the blurred pixel value
    const blurredGray = blurredData[i];

    // Apply Unsharp Mask with a very high sharpening factor (aggressive sharpening)
    data[i] = clamp(gray + (gray - blurredGray) * 4); // Sharpening factor increased to 4
    data[i + 1] = data[i]; // Set G and B to the same as R for grayscale
    data[i + 2] = data[i];
  }

  // Put sharpened image data back to canvas
  ctx.putImageData(imageData, 0, 0);
};

// Gaussian Blur function to create blurred image (for Unsharp Mask)
const gaussianBlur = (imageData: ImageData, width: number, height: number) => {
  const kernel = [
    [1, 4, 6, 4, 1],
    [4, 16, 24, 16, 4],
    [6, 24, 36, 24, 6],
    [4, 16, 24, 16, 4],
    [1, 4, 6, 4, 1],
  ];

  const kernelSum = 256; // Sum of all kernel elements
  const newData = new Uint8ClampedArray(imageData.data);

  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      let r = 0,
        g = 0,
        b = 0;

      // Apply kernel to blur the pixel neighborhood
      for (let ky = -2; ky <= 2; ky++) {
        for (let kx = -2; kx <= 2; kx++) {
          const px = (y + ky) * width + (x + kx);
          const weight = kernel[ky + 2][kx + 2];

          r += imageData.data[px * 4] * weight;
          g += imageData.data[px * 4 + 1] * weight;
          b += imageData.data[px * 4 + 2] * weight;
        }
      }

      // Normalize the result by dividing by the kernel sum
      const idx = (y * width + x) * 4;
      newData[idx] = clamp(r / kernelSum);
      newData[idx + 1] = clamp(g / kernelSum);
      newData[idx + 2] = clamp(b / kernelSum);
    }
  }

  return newData;
};

// Helper function to clamp pixel values between 0 and 255
const clamp = (value: number) => {
  return Math.min(Math.max(value, 0), 255);
};
