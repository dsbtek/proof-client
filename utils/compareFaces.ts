import * as ml5 from "ml5";
import p5 from "p5";

export const compareFaces = async (
  idFaceImage: HTMLImageElement,
  capturedFaceImage: p5.Image
) => {
  const faceApi = await ml5.faceApi();

  const detectSingleFace = async (image: HTMLImageElement | p5.Image) => {
    return new Promise<any>((resolve, reject) => {
      faceApi.detectSingle(image, (err: Error, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };

  const idFaceDescriptors = (await detectSingleFace(idFaceImage)).descriptor;
  const capturedFaceDescriptors = (await detectSingleFace(capturedFaceImage))
    .descriptor;

  const similarity = compareDescriptors(
    idFaceDescriptors,
    capturedFaceDescriptors
  );
  return similarity;
};

const compareDescriptors = (desc1: number[], desc2: number[]) => {
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    sum += Math.pow(desc1[i] - desc2[i], 2);
  }
  return Math.sqrt(sum);
};
