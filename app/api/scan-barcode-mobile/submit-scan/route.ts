import { NextRequest, NextResponse } from 'next/server';
import { parseAamvaData } from "@/utils/utils";
import { setIdDetails } from '@/redux/slices/drugTest';
import { setUserSessionId } from '@/redux/slices/appConfig';
import { store } from '@/redux/store'; // Import your Redux store
import redis from '@/utils/redis';
import { stringify } from 'querystring';

interface ScanRequestBody {
    participantId: string;
    data: string;
}

export async function POST(req: NextRequest) {
    const body = await req.json() as ScanRequestBody;

    const { participantId, data } = body;

    // Prepare the ID details using custom parsing logic
    const idDetails = parseDriverLicense(data);

    // Optionally: Dispatch action to save ID details in Redux store
    // store.dispatch(setIdDetails(idDetails));
    // store.dispatch(setUserSessionId(participantId));
    await redis.set(participantId, JSON.stringify(idDetails));
    console.log("Scanned data received successfully", JSON.stringify(idDetails));

    // Send response back to the client
    return NextResponse.json({ message: 'Scanned data received successfully' });
}

// Helper function to format ID details
const parseDriverLicense = (barcodeData: string) => {
    // Helper function to extract a field by its key
    const extractField = (data: string, key: string) => {
        const regex = new RegExp(`${key}([^\n\r]+)`);
        const match = data.match(regex);
        return match ? match[1].trim() : null;
    };

    // Create an object to store the extracted fields
    const parsedData = {
        last_name: extractField(barcodeData, 'DCS'), // Last name
        first_name: extractField(barcodeData, 'DAC'), // First name
        // middleName: extractField(barcodeData, 'DAD'), // Middle name
        // expirationDate: extractField(barcodeData, 'DBA'), // Expiration date
        // issuedDate: extractField(barcodeData, 'DBD'), // Issue date
        date_of_birth: extractField(barcodeData, 'DBB'), // Birthdate
        gender: extractField(barcodeData, 'DBC'), // Gender (1 = Male, 2 = Female)
        eyeColor: extractField(barcodeData, 'DAY'), // Eye color
        height: extractField(barcodeData, 'DAU'), // Height
        address: extractField(barcodeData, 'DAG'), // Street address
        city: extractField(barcodeData, 'DAI'), // City
        state: extractField(barcodeData, 'DAJ'), // State
        zipcode: extractField(barcodeData, 'DAK'), // ZIP Code
        // licenseNumber: extractField(barcodeData, 'DAQ'), // Driver's License Number
        // country: extractField(barcodeData, 'DCG'), // Country
        // idNumber: extractField(barcodeData, 'DCF') // Unique ID Number
    };

    return parsedData;
};
