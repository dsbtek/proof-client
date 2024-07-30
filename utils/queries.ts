// Boots AI CPU
export async function initializeAI() {
    try {
        const initializeResponse = await fetch(`${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/initialize`, {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate",
                "Authorization": `Basic ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
                "Content-Type": "application/json",
                "Connection": "keep-alive"
            }
        })

        return initializeResponse.json();
    } catch (error) {
        console.error('AI Intialization Error:', error)
    }
};

// Performs facial comparison using AI service
export async function compareFacesAI(str1: string, str2: string) {
    try {
        const similarityResponse = await fetch(`${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/compare-faces`, {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate",
                "Authorization": `Basic ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
                "Content-Type": "application/json",
                "Connection": "keep-alive"
            },
            body: JSON.stringify({
                base64_image1: str1,
                base64_image2: str2
            })
        })

        return similarityResponse.json();
    } catch (error) {
        console.error('AI Compare Faces Error:', error)
    };
};

// Performs Barcode Detections using AI service
export async function detectBarcodesAI(barcodeBase64: string) {
    try {
        const barcode = await fetch(`${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/scan-barcode`, {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate",
                "Authorization": `Basic ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
                "Content-Type": "application/json",
                "Connection": "keep-alive"
            },
            body: JSON.stringify({
                base64_image: barcodeBase64
            })
        })

        return barcode.json();
    } catch (error) {
        console.error('AI Detect Barcode Error:', error)
    };
};

export async function detectBarcodesAI2(barcodeBase64: string) {
    try {
        const barcode = await fetch(`${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/scan-barcode-2`, {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate",
                "Authorization": `Basic ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
                "Content-Type": "application/json",
                "Connection": "keep-alive"
            },
            body: JSON.stringify({
                base64_image: barcodeBase64
            })
        })

        return barcode.json();
    } catch (error) {
        console.error('AI Detect Barcode Error:', error)
    };
};

// Performs Barcode Detections using AI service
export async function scanIDAI(idBase64: string) {
    try {
        const idCardData = await fetch(`${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/read-id`, {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate",
                "Authorization": `Basic ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
                "Content-Type": "application/json",
                "Connection": "keep-alive"
            },
            body: JSON.stringify({
                base64_image: idBase64
            })
        })

        return idCardData.json();
    } catch (error) {
        console.error('AI Detect Barcode Error:', error)
    };
};
//     try {
//         const response = await fetch("/api/test-upload", {
//             method: "POST",
//             headers: {
//                 participant_id: participant_id as string,
//                 url: 'https://proof-portal.s3.amazonaws.com/proof-capture1.mp4',
//                 photo_url: 'https://proof-portal.s3.amazonaws.com/proof-capture1.jpg',
//                 start_time: startTime,
//                 end_time: endTime,
//                 submitted: '1706033912',
//                 barcode_string: barcode,
//                 internet_connection: 'true',
//                 app_version: '1.0.0',
//                 os_version: '14.6',
//                 phone_model: 'iPhone 12',
//                 device_name: 'iPhone 12',
//                 device_storage: '64GB',
//                 look_away_time: '0',
//                 hand_out_of_frame: '0',
//                 drugkitname: testingKit.kit_name,
//                 tracking_number: '1234567890',
//                 shippinglabelURL: 'https://proof-portal.s3.amazonaws.com/proof-capture1.jpg',
//                 scan_barcode_kit_value: '1234567890',
//                 detect_kit_value: '1234567890',
//                 signature_screenshot: 'https://proof-portal.s3.amazonaws.com/proof-capture1.jpg',
//                 proof_id: '1234567890',
//                 face_compare_url: '',
//                 face_scan1_url: '',
//                 face_scan2_url: '',
//                 face_scan3_url: '',
//                 face_scan1_percentage: '100',
//                 face_scan2_percentage: '100',
//                 face_scan3_percentage: '100',
//                 image_capture1_url: '',
//                 image_capture2_url: '',
//                 passport_photo_url: '',
//                 government_photo_url: '',
//                 first_name: first_name,
//                 last_name: last_name,
//                 date_of_birth: '1990-01-01',
//                 address: '1234 Main St',
//                 city: 'Anytown',
//                 state: 'CA',
//                 zipcode: '12345',
//             },
//         });
//         const data = await response.json();
//         if (data.data.statusCode === 200) {
//             console.log(data.data);
//             dispatch(saveConfirmationNo(data.data.confirmationNum));
//             return data.data;
//         } else {
//             console.error(data.data);
//         }
//     } catch (error) {
//         console.error("Self Drug Test Upload error:", error);
//     }
// };