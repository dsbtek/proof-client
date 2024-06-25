import Cookies from "js-cookie";
// import { FastAPI, SpeedUnits } from 'fast-api-speedtest';
// import FastSpeedtest from 'fast-speedtest-api';

/* COOKIE HANDLERS */
export const setCookie = (key: string, value: string, life: number) => {
    Cookies.set(key, value, {
        expires: life,
        sameSite: "strict",
    })
};

export const homeViewCookie = Cookies.get("homeView");

export const testViewCookie = Cookies.get("testView");

export const tutorialViewCookie = Cookies.get("tutsView");

export const welcomeCookie = Cookies.get("welView");


/* SYSTEM CHECKS */

//Checks Internet Speed
// export const FastTest = new FastAPI({
//     measureUpload: true,
//     downloadUnit: SpeedUnits.MBps,
//     timeout: 30000
// });

// export const speedtest = new FastSpeedtest({
//     token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", // required
//     verbose: false, // default: false
//     timeout: 10000, // default: 5000
//     https: false, // default: true
//     urlCount: 5, // default: 5
//     bufferSize: 8, // default: 8
//     unit: FastSpeedtest.UNITS.Mbps // default: Bps
// });

// Checks storage level
export async function checkAvailableStorage() {
    try {
        if (typeof navigator !== 'undefined') {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const { usage, quota } = await navigator.storage.estimate();
                const availableStorage = quota! - usage!;
                return (availableStorage / 1073741824).toFixed(0);
            } else {
                console.log("Storage estimation not supported.");
                return null;
            }
        }
    } catch (error: any) {
        console.error(error);
    }
}

// Generates system checks data
export async function generateSystemChecks(battery: number, storageLevel: number, signalStrenght: string, downloadSpeed: number) {
    return [
        {
            imgUrl: battery > 50 ? '/images/good-battery-level.png' : '/images/low-battery.png',
            title: "Battery Life is at least 50%",
            subTitle: battery > 50 ? `${battery}%. Looks good!` : `${battery}%. Please charge your device.`,
            status: battery > 50 ? 'pass' : 'fail',
        },
        {
            imgUrl: storageLevel > 1 ? '/images/good-disk-size.png' : '/images/low-disk-size.png',
            title: "At least 1GB of storage available",
            subTitle: storageLevel > 1 ? `${storageLevel}GB. Looks good!` : `${storageLevel}%. Consider deleting some items.`,
            status: storageLevel > 1 ? 'pass' : 'fail',
        },
        {
            imgUrl: downloadSpeed > 10 ? '/images/strong-network.png' : '/images/week-network.png',
            title: "Strong network signal",
            subTitle: downloadSpeed > 10 ? `${signalStrenght}%. Looks good!` : `${signalStrenght}%. Please move to a better location.`,
            status: downloadSpeed > 10 ? 'pass' : 'fail',
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
            resolve(base64data.split(',')[1]);
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
export function base64ToBlob(base64String: string, contentType = '', sliceSize = 512) {
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
}

// Function to convert stream to base64
export const streamToBase64 = async (stream: any) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    return buffer.toString('base64');
};

export function base64ToBuffer(base64: string): Buffer {

    if (!base64) {
        throw new Error("The input string is empty.");
    }

    try {
        // Decode base64 to a buffer
        const buffer = Buffer.from(base64, 'base64');

        // Check if the buffer is empty, which could indicate invalid base64 input
        if (buffer.length === 0) {
            throw new Error("The resulting buffer is empty, which might indicate invalid base64 input.");
        }

        return buffer;
    } catch (error: unknown) {
        // Handle any other errors that may occur during the conversion
        throw new Error(`Failed to convert base64 to buffer: ${(error as Error).message}`);
    }
}

export async function base64ToFile(base64: string, fileName: string, mimeType: string): Promise<File | null> {
    try {
        // Decode the base64 string, atob runs in the browser only
        const byteString = atob(base64.split(',')[1]);

        // Create an array of bytes
        const byteNumbers = new Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            byteNumbers[i] = byteString.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob from the byte array
        const blob = new Blob([byteArray], { type: mimeType });

        // Create a File from the Blob
        const file = new File([blob], fileName, { type: mimeType, lastModified: Date.now() });

        return file;
    } catch (error) {
        console.error("Error converting base64 string to file:", error);
        return null;
    }
}

export function bufferToFile(buffer: Buffer, fileName: string, mimeType: string): File {
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
            resolve(base64data.split(',')[1]);
        }
        reader.onerror = error => reject(error);
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

    const dd = today.getDate().toString().padStart(2, '0');
    const mm = (today.getMonth() + 1).toString().padStart(2, '0'); // Jan is 0!
    const yyyy = today.getFullYear().toString().substr(-2);

    const formattedDate = `${dd}/${mm}/${yyyy}`;

    const hh = today.getHours().toString().padStart(2, '0');
    const mins = today.getMinutes().toString().padStart(2, '0');
    const ss = today.getSeconds().toString().padStart(2, '0');

    const formattedTime = `${hh}:${mins}:${ss}`;

    return `${formattedDate}  ${formattedTime}`;
}