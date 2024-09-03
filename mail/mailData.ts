export interface UndetectedItem {
    last: number;
    current: number;
}

interface TestReviewItem {
    note: string;
    score: number;
    time_spent: string;
    last_time_val: string;
    first_time_val: string;
    detection_hotspot_first: string;
    detection_hotspot_last: string;
    label: string;
}

interface SpeakerSegment {
    speaker: string;
    segments: number[][][];
}

interface Result {
    score_ratios: {
        current: number;
        total: number;
    };
    test_review: {
        [key: string]: TestReviewItem;
    };
    undetected_hands: string | UndetectedItem[];
    undetected_faces: UndetectedItem[];
    speaker_segments: SpeakerSegment[];
}

interface AIResponseObject {
    status: string;
    result: Result;
}


export const detections: AIResponseObject = {
    "status": "complete",
    "result": {
        "score_ratios": {
            "current": 12.333333333333334,
            "total": 175
        },
        "test_review": {
            "fedex-package": {
                "note": "Item successfully detected",
                "score": 10,
                "time_spent": "14466.666666666668",
                "last_time_val": "1724711931",
                "first_time_val": "1724711906",
                "detection_hotspot_first": "00:00:15:066",
                "detection_hotspot_last": "00:00:29:533",
                "label": "Unopened Sealed Testing Materials Packet"
            },
            "mouth-open": {
                "note": "Item not detected",
                "score": 0,
                "time_spent": "0",
                "last_time_val": "0",
                "first_time_val": "0",
                "detection_hotspot_first": "00:00:00:000",
                "detection_hotspot_last": "00:00:00:000",
                "label": "Clear Mouth Check"
            },
            "intercept-package": {
                "note": "Item not detected",
                "score": 0,
                "time_spent": "0",
                "last_time_val": "0",
                "first_time_val": "0",
                "detection_hotspot_first": "00:00:00:000",
                "detection_hotspot_last": "00:00:00:000",
                "label": "Intercept Material Package"
            },
            "sealed-saliva-swab": {
                "note": "Item not detected",
                "score": 0,
                "time_spent": "0",
                "last_time_val": "0",
                "first_time_val": "0",
                "detection_hotspot_first": "00:00:00:000",
                "detection_hotspot_last": "00:00:00:000",
                "label": "Sealed Collection Device (Saliva Swab)"
            },
            "open-saliva-swab": {
                "note": "Item not detected",
                "score": 0,
                "time_spent": "0",
                "last_time_val": "0",
                "first_time_val": "0",
                "detection_hotspot_first": "00:00:00:000",
                "detection_hotspot_last": "00:00:00:000",
                "label": "Open Collection Device (Saliva Swab)"
            },
            "saliva-swab": {
                "note": "Item not detected",
                "score": 0,
                "time_spent": "0",
                "last_time_val": "0",
                "first_time_val": "0",
                "detection_hotspot_first": "00:00:00:000",
                "detection_hotspot_last": "00:00:00:000",
                "label": "Collection Device (Saliva Swab)"
            },
            "mouth-open-with-swab": {
                "note": "Item not detected",
                "score": 0,
                "time_spent": "0",
                "last_time_val": "0",
                "first_time_val": "0",
                "detection_hotspot_first": "00:00:00:000",
                "detection_hotspot_last": "00:00:00:000",
                "label": "Proper Use of Collection Device / Device in mouth"
            },
            "intercept-swab-in-container": {
                "note": "Item not detected",
                "score": 0,
                "time_spent": "0",
                "last_time_val": "0",
                "first_time_val": "0",
                "detection_hotspot_first": "00:00:00:000",
                "detection_hotspot_last": "00:00:00:000",
                "label": "Properly Placed Device in Specimen Vial"
            },
            "saliva-container": {
                "note": "Item not detected",
                "score": 0,
                "time_spent": "0",
                "last_time_val": "0",
                "first_time_val": "0",
                "detection_hotspot_first": "00:00:00:000",
                "detection_hotspot_last": "00:00:00:000",
                "label": "Specimen Vial"
            },
            "sealed-saliva-container": {
                "note": "Item partially detected",
                "score": 2.3333333333333335,
                "time_spent": "200.00000000000182",
                "last_time_val": "1724711900",
                "first_time_val": "1724711900",
                "detection_hotspot_first": "00:00:11:466",
                "detection_hotspot_last": "00:00:11:666",
                "label": "Sealed and Signed / Dated Specimen Vial Seal"
            },
            "swab-container-barcode": {
                "note": "Item not detected",
                "score": 0,
                "time_spent": "0",
                "last_time_val": "0",
                "first_time_val": "0",
                "detection_hotspot_first": "00:00:00:000",
                "detection_hotspot_last": "00:00:00:000",
                "label": "Specimen Vial with Barcode"
            },
            "sample-bag-empty": {
                "note": "Item not detected",
                "score": 0,
                "time_spent": "0",
                "last_time_val": "0",
                "first_time_val": "0",
                "detection_hotspot_first": "00:00:00:000",
                "detection_hotspot_last": "00:00:00:000",
                "label": "Empty Specimen Bag"
            },
            "sample-bag-filled": {
                "note": "Item not detected",
                "score": 0,
                "time_spent": "0",
                "last_time_val": "0",
                "first_time_val": "0",
                "detection_hotspot_first": "00:00:00:000",
                "detection_hotspot_last": "00:00:00:000",
                "label": "Filled and Sealed Specimen Bag"
            },
            "fedex-barcode": {
                "note": "Item not detected",
                "score": 0,
                "time_spent": "0",
                "last_time_val": "0",
                "first_time_val": "0",
                "detection_hotspot_first": "00:00:00:000",
                "detection_hotspot_last": "00:00:00:000",
                "label": "Shipping barcode scanned during recording"
            }
        },
        "undetected_hands": [{
            "last": 10000,
            "current": 50000,
        },
        {
            "last": 65000,
            "current": 78000,
        },
        {
            "last": 100000,
            "current": 550000,
        }],
        "undetected_faces": [{
            "last": 10000,
            "current": 50000,
        },
        {
            "last": 65000,
            "current": 78000,
        },
        {
            "last": 100000,
            "current": 550000,
        }],
        "speaker_segments": [
            {
                "speaker": "SPEAKER_00",
                "segments": [
                    [
                        [
                            8.532423208191126,
                            25.59726962457338
                        ],
                        [
                            3762.798634812287,
                            7005.119453924915
                        ]
                    ]
                ]
            },
            {
                "speaker": "SPEAKER_01",
                "segments": [
                    [
                        [
                            7005.119453924915,
                            10213.310580204778
                        ]
                    ]
                ]
            }
        ]
    }
};

// export const detections = Object.entries(result);