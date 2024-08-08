interface DetectionDetails {
    current?: number;
    total?: number;
    note?: string;
    score?: number;
    label?: string;
    time_spent?: string;
    last_time_val?: string;
    first_time_val?: string;
    detection_hotspot_first?: string;
    detection_hotspot_last?: string;
}

interface AIObj {
    [key: string]: DetectionDetails  // Index signature to accommodate dynamic keys
}

const result: AIObj = {
    "score_ratios": { current: 15.0, total: 115 },
    "mouth-open": {
        note: "Item not detected",
        score: 0.0,
        time_spent: "0",
        last_time_val: "0",
        first_time_val: "0",
    },
    "sealed-oral-tox": {
        note: "Item not detected",
        score: 0.0,
        time_spent: "0",
        last_time_val: "0",
        first_time_val: "0",
    },
    "open-oral-tox": {
        note: "Item not detected",
        score: 0.0,
        time_spent: "0",
        last_time_val: "0",
        first_time_val: "0",
    },
    "oral-tox": {
        note: "Item not detected",
        score: 0.0,
        time_spent: "0",
        last_time_val: "0",
        first_time_val: "0",
    },
    "oral-tox-swab": {
        note: "Item not detected",
        score: 0.0,
        time_spent: "0",
        last_time_val: "0",
        first_time_val: "0",
    },
    "mouth-with-oral-tox-swab": {
        note: "Item partially detected",
        score: 15.0,
        time_spent: "-7866.666666666664",
        last_time_val: "1719794471",
        first_time_val: "1719794438",
    },
    "ph-reading": {
        note: "Item not detected",
        score: 0.0,
        time_spent: "0",
        last_time_val: "0",
        first_time_val: "0",
    },
    "mouth-with-strip": {
        note: "Item not detected",
        score: 0.0,
        time_spent: "0",
        last_time_val: "0",
        first_time_val: "0",
    },
};

export const detections = Object.entries(result);