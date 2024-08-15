// Boots AI CPU
export async function initializeAI() {
    try {
        const initializeResponse = await fetch(`${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/initialize`, {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
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
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
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
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
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
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
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
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_BEAM_AUTH}`,
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