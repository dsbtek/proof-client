import Cookies from "js-cookie";
// import { FastAPI, SpeedUnits } from 'fast-api-speedtest';
// import FastSpeedtest from 'fast-speedtest-api';

/* COOKIE HANDLERS */
import Crypto from "crypto-js";
import nlp from "compromise";

export const setCookie = (key: string, value: string, life: number) => {
  Cookies.set(key, value, {
    expires: life,
    sameSite: "strict",
  });
};

export const homeViewCookie = Cookies.get("homeView");

export const testViewCookie = Cookies.get("testView");

export const tutorialViewCookie = Cookies.get("tutsView");

export const welcomeCookie = Cookies.get("welView");

/* SYSTEM CHECKS */
// Checks storage level
export async function checkAvailableStorage() {
  try {
    if (typeof navigator !== "undefined") {
      if ("storage" in navigator && "estimate" in navigator.storage) {
        const { usage, quota } = await navigator.storage.estimate();
        const usageInMB = Number((usage! / (1024 * 1024)).toFixed(0));
        const quotaInMB = Number((quota! / (1024 * 1024)).toFixed(0));
        const availableStorage = quotaInMB - usageInMB;
        return (availableStorage / 10000).toFixed(0);
      } else {
        console.log("Storage estimation not supported.");
        return null;
      }
    }
  } catch (error: any) {
    console.error(error);
  }
}

// Checks the effective bandwidth estimate in megabits per second
export async function checkSignalStrength() {
  try {
    if (typeof navigator !== "undefined") {
      if ("connection" in navigator) {
        const connection = navigator.connection as any;
        const downlink = connection.downlink as number;
        return downlink;
      } else {
        console.log(
          "The Network Information API is not supported by your browser."
        );
        return null;
      }
    }
  } catch (error: any) {
    console.error(error);
  }
}

// Generates system checks data
export async function generateSystemChecks(
  battery: number,
  storageLevel: number,
  effectiveBandwidth: number
) {
  return [
    {
      imgUrl:
        battery > 50 ? "/icons/battery-good.svg" : "/icons/battery-bad.svg",
      title: "Battery Life is at least 50%",
      subTitle:
        battery > 50
          ? `${battery}%. Looks good!`
          : `${battery}%. Please charge your device.`,
      status: battery > 50 ? "pass" : "fail",
    },
    {
      imgUrl:
        storageLevel > 1 ? "/icons/memory-good.svg" : "/icons/memory-bad.svg",
      title: "At least 1GB of storage available",
      subTitle:
        storageLevel > 1
          ? `${storageLevel}GB. Looks good!`
          : `${storageLevel}%. Consider deleting some items.`,
      status: storageLevel > 1 ? "pass" : "fail",
    },
    {
      imgUrl:
        effectiveBandwidth > 1
          ? "/icons/networ-strenght-good.svg"
          : "/icons/network-strenght-bad.svg",
      title: "Strong network signal",
      subTitle:
        effectiveBandwidth > 1
          ? `Bandwidth: ${effectiveBandwidth}MB. Looks good!`
          : `Bandwidth: ${effectiveBandwidth}MB. Please move to a better location.`,
      status: effectiveBandwidth > 1 ? "pass" : "fail",
    },
  ];
}

/* DATA HANDLERS */
// Convert Blob to Base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data);
    };
    reader.onerror = reject;
  });
};

// Convert Blob to Buffer
export function blobToBuffer(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = () => {
      resolve(Buffer.from(reader.result as ArrayBuffer));
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

// Convert Base64 to Blob
export async function base64ToBlob(
  base64String: string,
  contentType = "",
  sliceSize = 512
) {
  try {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  } catch (error: any) {
    console.error("Base64ToBlob Error:", error);
  }
}

// Function to convert stream to base64
export const streamToBase64 = async (stream: any) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  return buffer.toString("base64");
};

export function base64ToBuffer(base64: string): Buffer {
  if (!base64) {
    throw new Error("The input string is empty.");
  }

  try {
    // Decode base64 to a buffer
    const buffer = Buffer.from(base64, "base64");

    // Check if the buffer is empty, which could indicate invalid base64 input
    if (buffer.length === 0) {
      throw new Error(
        "The resulting buffer is empty, which might indicate invalid base64 input."
      );
    }

    return buffer;
  } catch (error: unknown) {
    // Handle any other errors that may occur during the conversion
    throw new Error(
      `Failed to convert base64 to buffer: ${(error as Error).message}`
    );
  }
}

export async function base64ToFile(
  base64: string,
  fileName: string,
  mimeType: string
): Promise<File | null> {
  try {
    // Decode the base64 string, atob runs in the browser only
    const byteString = atob(base64.split(",")[1]);

    // Create an array of bytes
    const byteNumbers = new Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the byte array
    const blob = new Blob([byteArray], { type: mimeType });

    // Create a File from the Blob
    const file = new File([blob], fileName, {
      type: mimeType,
      lastModified: Date.now(),
    });

    return file;
  } catch (error) {
    console.error("Error converting base64 string to file:", error);
    return null;
  }
}

export function bufferToFile(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): File {
  // Create a Blob from the buffer
  const blob = new Blob([buffer], { type: mimeType });

  // Create a File from the Blob
  const file = new File([blob], fileName, { type: mimeType });

  return file;
}

export function fileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64data = reader.result as string;
      resolve(base64data.split(",")[1]);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(arrayBuffer));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

/* DATE HANDLERS */

export function dateTimeInstance() {
  const today: Date = new Date();

  const dd = today.getDate().toString().padStart(2, "0");
  const mm = (today.getMonth() + 1).toString().padStart(2, "0"); // Jan is 0!
  const yyyy = today.getFullYear().toString().substr(-2);

  const formattedDate = `${dd}/${mm}/${yyyy}`;

  const hh = today.getHours().toString().padStart(2, "0");
  const mins = today.getMinutes().toString().padStart(2, "0");
  const ss = today.getSeconds().toString().padStart(2, "0");

  const formattedTime = `${hh}:${mins}:${ss}`;

  return `${formattedDate}  ${formattedTime}`;
}

// Extract screen information from Drug_kit
type DataObject = { [key: string]: any };

export function extractAndFormatPreTestScreens(data: DataObject): DataObject[] {
  // Extract screen-related information into a structured object
  const screens = Object.keys(data)
    .filter((key) => key.startsWith("Screen_"))
    .reduce((acc: { [screenNumber: string]: DataObject }, key) => {
      const screenNumber = key.split("_")[1];
      if (!acc[screenNumber]) {
        acc[screenNumber] = {};
      }
      acc[screenNumber][key] = data[key];
      return acc;
    }, {});

  // Convert the structured object to an array of screen objects
  const screenArray = Object.values(screens);

  // Filter out screen objects with all null values
  const filteredScreens = screenArray.filter((screen) =>
    Object.values(screen).some((value) => value !== null)
  );

  return filteredScreens;
}

const convertToByte = (key: any) => {
  return Crypto.AES.decrypt(key, process.env.NEXT_PUBLIC_SECRET_KEY || "");
};

const convertToStr = (key: any) => {
  return key.toString(Crypto.enc.Utf8);
};

export function decryptIdAndCredentials(
  participant_id: string | null,
  pin: string | null
) {
  const decryptedParticipant_id = convertToByte(participant_id);
  const decryptedPin = convertToByte(pin);
  const strParticipantId = convertToStr(decryptedParticipant_id);
  const strPin = convertToStr(decryptedPin);
  return { strParticipantId, strPin };
}
interface Question {
  skip_logic: boolean;
  required: boolean;
  question_type: string;
  question_id: string;
  question: string;
  image_url: string | null;
}
export function removeSkipQuestions(data: Array<Question>) {
  let result: Question[] = [];
  data.map((quetion: Question) => {
    if (quetion?.skip_logic) {
      result.push(quetion);
    }
  });
  return result;
}

export const hasPermission = (permission: string, userPermissions: string) => {
  const permissionsArray = userPermissions?.split(";");
  return permissionsArray?.includes(permission);
};

export const transformScreensData = (data: Object) => {
  if (data) {
    const k = Object.keys(data);
    const getKey = k[0];
    const match = getKey.match(/Screen_(\d+)/);
    if (match) {
      const number = match[1];
      return parseInt(number);
    } else {
      console.log("No match found");
    }
  }
};

export const formatList = (input: string): string => {
  return input.replace(/-/g, "<br><br> <span>&#8226;</span>");
};

export function parseAamvaData(data: string | null): Record<string, any> | string {
  /**
   * Parses AAMVA (American Association of Motor Vehicle Administrators) Driver License/Identification Card data.
   *
   * @param {string | null} data - The raw data string from the driver's license or ID card.
   * @returns {Record<string, any> | string} A dictionary containing the parsed fields, or "Invalid Data" if the input is null or undefined.
   */

  // An object to store the parsed data
  const parsedData: Record<string, any> = {};

  // Helper functions
  const getGender = (x: string): string => {
    if (x === "1") return "MALE";
    if (x === "2") return "FEMALE";
    return "UNSPECIFIED";
  };

  const convertToTimestamp = (dateStr: string): number => {
    /**
     * Converts a date string in MMDDYYYY format to a Unix timestamp.
     *
     * @param {string} dateStr - The date string in MMDDYYYY format.
     * @returns {number} The Unix timestamp.
     */
    const [month, day, year] = [dateStr.slice(0, 2), dateStr.slice(2, 4), dateStr.slice(4)];
    const dateObj = new Date(`${year}-${month}-${day}`);
    return Math.floor(dateObj.getTime() / 1000);
  };

  // Defines a list of fields to extract
  const fields: Array<[string, string, ((x: string) => any)?]> = [
    ["DAQ", "Driver's License Number"],
    ["DCS", "Last Name"],
    ["DAC", "First Name"],
    ["DAD", "Middle Name"],
    ["DBD", "Document Issue Date", convertToTimestamp],
    ["DBB", "Date of Birth", convertToTimestamp],
    ["DBA", "Document Expiration Date", convertToTimestamp],
    ["DBC", "Gender", getGender],
    ["DAU", "Height"],
    ["DAY", "Eye Color"],
    ["DAG", "Street Address"],
    ["DAI", "City"],
    ["DAJ", "State"],
    ["DAK", "Postal Code"],
    ["DCG", "Country"],
    ["DCK", "Inventory Control Number"],
    ["DDK", "Document Discriminator"],
    ["DDB", "Card Revision Date", convertToTimestamp],
  ];

  if (!data) {
    return "Invalid Data";
  }

  // Extract each field using regex
  fields.forEach(([code, description, func]) => {
    const match = data.match(new RegExp(`${code}([^\\n\\r]*)`));
    if (match) {
      parsedData[description] = func ? func(match[1].trim()) : match[1].trim();
    }
  });

  return parsedData;
};



export const extractFaceImage = (
  img: HTMLImageElement,
  face: any,
  paddingRatio = 0.5
) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

  const keypoints = face.scaledMesh;
  const xCoords = keypoints.map((point: number[]) => point[0]);
  const yCoords = keypoints.map((point: number[]) => point[1]);
  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const minY = Math.min(...yCoords);
  const maxY = Math.max(...yCoords);

  const paddingX = (maxX - minX) * paddingRatio;
  const paddingY = (maxY - minY) * paddingRatio;

  const startX = Math.max(minX - paddingX, 0);
  const startY = Math.max(minY - paddingY, 0);
  const endX = Math.min(maxX + paddingX, img.width);
  const endY = Math.min(maxY + paddingY, img.height);

  canvas.width = endX - startX;
  canvas.height = endY - startY;
  context.drawImage(
    img,
    startX,
    startY,
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Apply sharpening filter to improve image quality
  // context.filter = 'contrast(1.2) brightness(1.1)'; // Adjust contrast and brightness
  // context.drawImage(canvas, 0, 0);

  return canvas.toDataURL("image/png");
};

export function boldActionWords(text: string) {
  const doc = nlp(text);
  const verbs = doc.verbs().out('array');

  // Replace each verb with bolded version
  verbs.forEach((verb: string[]) => {
    const boldedVerb = `<strong class="bold-action-word">${verb}</strong>`;
    text = text.replace(new RegExp(`\\b${verb}\\b`, 'gi'), boldedVerb);
  });
  return text;
}