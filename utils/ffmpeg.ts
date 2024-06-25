import ffmpeg from 'ffmpeg.js';
import fs from 'fs';
import * as path from 'path';

import { fileToBase64 } from "@/utils/utils";

// Encode stream feed
export const videoEncoder = async (testData: Uint8Array) => {
    try {
        const fileName = 'initstream.webm';
        const outputFileName = 'outputstream.webm';

        const encodedVideo = ffmpeg({
            MEMFS: [{ name: fileName, data: testData }],
            arguments: ['-i', fileName, '-r', '30', '-c:v', 'libx264', '-c:a', 'aac', outputFileName],
        });

        const videoBitArray = encodedVideo.MEMFS[0];

        const processedBlob = new Blob([videoBitArray.data], { type: 'video/mp4' });

        const file = new File([processedBlob], 'video.mp4', { type: 'video/mp4' });
        const fileData = await fileToBase64(file);
        return { fileData, processedBlob };
    } catch (error) {
        console.error('Server Encoding Failed:', error);
    }
}