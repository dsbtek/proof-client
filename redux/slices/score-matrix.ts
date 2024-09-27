import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AIItem {
    label: string;
    value: string;
    score: number;
}

interface PayloadType {
    label: string;
    index: number;
    score: number;
}

interface ScoreMatrix {
    [key: string]: AIItem[];
};

const initialState: ScoreMatrix = {
    "a0q2J00000A07UpQAJ": [
        {
            "label": "Unopened Sealed Testing Materials Packet",
            "value": "fedex-package",
            "score": 10
        },
        {
            "label": "Clear Mouth Check",
            "value": "mouth-open",
            "score": 10
        },
        {
            "label": "Quantisal Material Package",
            "value": "quantisal-package",
            "score": 10
        },
        {
            "label": "Sealed Collection Device (Saliva Swab)",
            "value": "sealed-saliva-swab",
            "score": 10
        },
        {
            "label": "Open Collection Device (Saliva Swab)",
            "value": "open-saliva-swab",
            "score": 5
        },
        {
            "label": "Collection Device (Saliva Swab)",
            "value": "saliva-swab",
            "score": 10
        },
        {
            "label": "Proper Use of Collection Device / Device in mouth",
            "value": "mouth-open-with-swab",
            "score": 50
        },
        {
            "label": "Specimen Vial",
            "value": "saliva-container",
            "score": 5
        },
        {
            "label": "Specimen Vial with Barcode",
            "value": "swab-container-barcode",
            "score": 10
        },
        {
            "label": "Empty Specimen Bag",
            "value": "sample-bag-empty",
            "score": 5
        },
        {
            "label": "Filled and Sealed Specimen Bag",
            "value": "sample-bag-filled",
            "score": 20
        },
        {
            "label": "Shipping barcode scanned during recording",
            "value": "fedex-barcode",
            "score": 10
        }
    ],
    "a0q2J00000ANlwbQAD": [
        {
            "label": "Unopened Sealed Testing Materials Packet",
            "value": "fedex-package",
            "score": 10
        },
        {
            "label": "Clear Mouth Check",
            "value": "mouth-open",
            "score": 10
        },
        {
            "label": "Quantisal Material Package",
            "value": "quantisal-package",
            "score": 10
        },
        {
            "label": "Sealed Collection Device (Saliva Swab)",
            "value": "sealed-saliva-swab",
            "score": 10
        },
        {
            "label": "Open Collection Device (Saliva Swab)",
            "value": "open-saliva-swab",
            "score": 5
        },
        {
            "label": "Collection Device (Saliva Swab)",
            "value": "saliva-swab",
            "score": 10
        },
        {
            "label": "Proper Use of Collection Device / Device in mouth",
            "value": "mouth-open-with-swab",
            "score": 50
        },
        {
            "label": "Specimen Vial",
            "value": "saliva-container",
            "score": 5
        },
        {
            "label": "Specimen Vial with Barcode",
            "value": "swab-container-barcode",
            "score": 10
        },
        {
            "label": "Empty Specimen Bag",
            "value": "sample-bag-empty",
            "score": 5
        },
        {
            "label": "Filled and Sealed Specimen Bag",
            "value": "sample-bag-filled",
            "score": 20
        },
        {
            "label": "Shipping barcode scanned during recording",
            "value": "fedex-barcode",
            "score": 10
        }
    ],
    "a0q2J00000Ciy3bQAB": [
        {
            "label": "Unopened Sealed Testing Materials Packet",
            "value": "fedex-package",
            "score": 10
        },
        {
            "label": "Clear Mouth Check",
            "value": "mouth-open",
            "score": 10
        },
        {
            "label": "Quantisal Material Package",
            "value": "quantisal-package",
            "score": 10
        },
        {
            "label": "Sealed Collection Device (Saliva Swab)",
            "value": "sealed-saliva-swab",
            "score": 10
        },
        {
            "label": "Open Collection Device (Saliva Swab)",
            "value": "open-saliva-swab",
            "score": 5
        },
        {
            "label": "Collection Device (Saliva Swab)",
            "value": "saliva-swab",
            "score": 10
        },
        {
            "label": "Proper Use of Collection Device / Device in mouth",
            "value": "mouth-open-with-swab",
            "score": 50
        },
        {
            "label": "Specimen Vial",
            "value": "saliva-container",
            "score": 5
        },
        {
            "label": "Specimen Vial with Barcode",
            "value": "swab-container-barcode",
            "score": 10
        },
        {
            "label": "Empty Specimen Bag",
            "value": "sample-bag-empty",
            "score": 5
        },
        {
            "label": "Filled and Sealed Specimen Bag",
            "value": "sample-bag-filled",
            "score": 20
        },
        {
            "label": "Shipping barcode scanned during recording",
            "value": "fedex-barcode",
            "score": 10
        }
    ],
    "a0q2J00000BM9IDQA1": [
        {
            "label": "Proper Lighting",
            "score": 10,
            "value": "proper-lightening"
        },
        {
            "label": "Acceptable Camera View",
            "score": 10,
            "value": "acceptable-camera-view"
        },
        {
            "label": "Participant in Frame",
            "score": 10,
            "value": "participant-in-frame"
        },
        {
            "label": "Closed Pack",
            "value": "fedex-package",
            "score": 10
        },
        {
            "label": "Mouth Check",
            "value": "mouth-open",
            "score": 10
        },
        {
            "label": "Person In Frame",
            "value": "participant-in-frame",
            "score": 10
        },
        {
            "label": "Intercept Material Package",
            "value": "intercept-package",
            "score": 10
        },
        {
            "label": "Sealed Collection Device (Saliva Swab)",
            "value": "sealed-saliva-swab",
            "score": 10
        },
        {
            "label": "Open Collection Device (Saliva Swab)",
            "value": "open-saliva-swab",
            "score": 5
        },
        {
            "label": "Swab Visible",
            "value": "saliva-swab",
            "score": 10
        },
        {
            "label": "Swab in Mouth",
            "value": "mouth-open-with-swab",
            "score": 50
        },
        {
            "label": "Specimen Vial in Hand",
            "value": "intercept-swab-in-container",
            "score": 10
        },
        {
            "label": "Specimen Vial Visible",
            "value": "saliva-container",
            "score": 5
        },
        {
            "label": "Sealed Specimen Vial",
            "value": "sealed-saliva-container",
            "score": 10
        },
        {
            "label": "Specimen Vial with Barcode",
            "value": "swab-container-barcode",
            "score": 10
        },
        {
            "label": "COC Form",
            "value": "coc-form",
            "score": 10
        },
        {
            "label": "Empty Specimen Bag",
            "value": "sample-bag-empty",
            "score": 5
        },
        {
            "label": "Specimen Bag",
            "value": "sample-bag-filled",
            "score": 20
        },
        {
            "label": "Clinical Pak",
            "value": "clinical-pak",
            "score": 10
        },
        {
            "label": "Shipping Label",
            "value": "fedex-barcode",
            "score": 10
        }
    ],
    "a0qHt00000AiRGcIAN": [
        {
            "label": "Proper Lighting",
            "score": 10,
            "value": "proper-lightening"
        },
        {
            "label": "Acceptable Camera View",
            "score": 10,
            "value": "acceptable-camera-view"
        },
        {
            "label": "Participant in Frame",
            "score": 10,
            "value": "participant-in-frame"
        },
        {
            "label": "Closed Pack",
            "value": "fedex-package",
            "score": 10
        },
        {
            "label": "Mouth Check",
            "value": "mouth-open",
            "score": 10
        },
        {
            "label": "Person In Frame",
            "value": "participant-in-frame",
            "score": 10
        },
        {
            "label": "Intercept Material Package",
            "value": "intercept-package",
            "score": 10
        },
        {
            "label": "Sealed Collection Device (Saliva Swab)",
            "value": "sealed-saliva-swab",
            "score": 10
        },
        {
            "label": "Open Collection Device (Saliva Swab)",
            "value": "open-saliva-swab",
            "score": 5
        },
        {
            "label": "Swab Visible",
            "value": "saliva-swab",
            "score": 10
        },
        {
            "label": "Swab in Mouth",
            "value": "mouth-open-with-swab",
            "score": 50
        },
        {
            "label": "Specimen Vial in Hand",
            "value": "intercept-swab-in-container",
            "score": 10
        },
        {
            "label": "Specimen Vial Visible",
            "value": "saliva-container",
            "score": 5
        },
        {
            "label": "Sealed Specimen Vial",
            "value": "sealed-saliva-container",
            "score": 10
        },
        {
            "label": "Specimen Vial with Barcode",
            "value": "swab-container-barcode",
            "score": 10
        },
        {
            "label": "COC Form",
            "value": "coc-form",
            "score": 10
        },
        {
            "label": "Empty Specimen Bag",
            "value": "sample-bag-empty",
            "score": 5
        },
        {
            "label": "Specimen Bag",
            "value": "sample-bag-filled",
            "score": 20
        },
        {
            "label": "Clinical Pak",
            "value": "clinical-pak",
            "score": 10
        },
        {
            "label": "Shipping Label",
            "value": "fedex-barcode",
            "score": 10
        }
    ],
    "a0qPI000003EYZcYAO": [
        {
            "label": "Unopened Sealed Testing Materials Packet",
            "value": "fedex-package",
            "score": 10
        },
        {
            "label": "Clear Mouth Check",
            "value": "mouth-open",
            "score": 10
        },
        {
            "label": "Sealed Collection Device (Oral Tox)",
            "value": "sealed-oral-tox",
            "score": 10
        },
        {
            "label": "Opened Collection Device (Oral Tox)",
            "value": "open-oral-tox",
            "score": 5
        },
        {
            "label": "Collection Device (Oral Tox)",
            "value": "oral-tox",
            "score": 10
        },
        {
            "label": "Collection Device Swab (Oral Tox)",
            "value": "oral-tox-swab",
            "score": 10
        },
        {
            "label": "Proper Use of Collection Device / Device in mouth",
            "value": "mouth-with-oral-tox-swab",
            "score": 50
        },
        {
            "label": "PH Reading",
            "value": "ph-reading",
            "score": 10
        },
        {
            "label": "Collection Device (Alcohol Strip)",
            "value": "mouth-with-strip",
            "score": 10
        }
    ],
    "a0qPI000003BM8OYAW": [
        {
            "label": "Unopened Sealed Testing Materials Packet",
            "value": "fedex-package",
            "score": 10
        },
        {
            "label": "Clear Mouth Check",
            "value": "mouth-open",
            "score": 10
        },
        {
            "label": "Sealed Collection Device (Oral Tox)",
            "value": "sealed-oral-tox",
            "score": 10
        },
        {
            "label": "Opened Collection Device (Oral Tox)",
            "value": "open-oral-tox",
            "score": 5
        },
        {
            "label": "Collection Device (Oral Tox)",
            "value": "oral-tox",
            "score": 10
        },
        {
            "label": "Collection Device Swab (Oral Tox)",
            "value": "oral-tox-swab",
            "score": 10
        },
        {
            "label": "Proper Use of Collection Device / Device in mouth",
            "value": "mouth-with-oral-tox-swab",
            "score": 50
        },
        {
            "label": "PH Reading",
            "value": "ph-reading",
            "score": 10
        },
        {
            "label": "Collection Device (Alcohol Strip)",
            "value": "mouth-with-strip",
            "score": 10
        }
    ],
    "a0qPI000004WV6PYAW": [
        {
            "label": "Unopened Sealed Testing Materials Packet",
            "value": "fedex-package",
            "score": 10
        },
        {
            "label": "Clear Mouth Check",
            "value": "mouth-open",
            "score": 10
        },
        {
            "label": "Sealed Collection Device (Oral Tox)",
            "value": "sealed-oral-tox",
            "score": 10
        },
        {
            "label": "Opened Collection Device (Oral Tox)",
            "value": "open-oral-tox",
            "score": 5
        },
        {
            "label": "Collection Device (Oral Tox)",
            "value": "oral-tox",
            "score": 10
        },
        {
            "label": "Collection Device Swab (Oral Tox)",
            "value": "oral-tox-swab",
            "score": 10
        },
        {
            "label": "Proper Use of Collection Device / Device in mouth",
            "value": "mouth-with-oral-tox-swab",
            "score": 50
        },
        {
            "label": "PH Reading",
            "value": "ph-reading",
            "score": 10
        },
        {
            "label": "Collection Device (Alcohol Strip)",
            "value": "mouth-with-strip",
            "score": 10
        }
    ],
    "a0qPI000003Ud8gYAC": [
        {
            "label": "FedEx Package",
            "value": "fedex-package",
            "score": 5
        },
        {
            "label": "Blood Spot Package",
            "value": "blood-spot-package",
            "score": 10
        },
        {
            "label": "Blood Pincer",
            "value": "blood-pincer",
            "score": 5
        },
        {
            "label": "Empty Blood Spot Card",
            "value": "empty-blood-spot-card",
            "score": 15
        },
        {
            "label": "Pricking Finger Procedure",
            "value": "pricking-finger-proc",
            "score": 5
        },
        {
            "label": "Blood Collection Procedure",
            "value": "blood-collection-proc",
            "score": 30
        },
        {
            "label": "Filled Blood Spot Card",
            "value": "filled-blood-spot-card",
            "score": 10
        },
        {
            "label": "Sealed Blood Sample Package",
            "value": "sealed-blood-sample-package",
            "score": 10
        },
        {
            "label": "Blood Spot Sample Bag",
            "value": "blood-spot-sample-bag",
            "score": 5
        },
        {
            "label": "Shipping barcode scanned during recording",
            "value": "fedex-barcode",
            "score": 10
        }
    ],
    "a0qHt00000C8B8gIAF": [
        {
            "label": "FedEx Package",
            "value": "fedex-package",
            "score": 5
        },
        {
            "label": "Blood Spot Package",
            "value": "blood-spot-package",
            "score": 10
        },
        {
            "label": "Blood Pincer",
            "value": "blood-pincer",
            "score": 5
        },
        {
            "label": "Empty Blood Spot Card",
            "value": "empty-blood-spot-card",
            "score": 15
        },
        {
            "label": "Pricking Finger Procedure",
            "value": "pricking-finger-proc",
            "score": 5
        },
        {
            "label": "Blood Collection Procedure",
            "value": "blood-collection-proc",
            "score": 30
        },
        {
            "label": "Filled Blood Spot Card",
            "value": "filled-blood-spot-card",
            "score": 10
        },
        {
            "label": "Sealed Blood Sample Package",
            "value": "sealed-blood-sample-package",
            "score": 10
        },
        {
            "label": "Blood Spot Sample Bag",
            "value": "blood-spot-sample-bag",
            "score": 5
        },
        {
            "label": "Shipping barcode scanned during recording",
            "value": "fedex-barcode",
            "score": 10
        }
    ],
    "a0qPI000003GXkgYAG": [
        {
            "label": "Unopened Sealed Testing Materials Packet",
            "value": "fedex-package",
            "score": 5
        },
        {
            "label": "Blood Spot Package",
            "value": "blood-spot-package",
            "score": 10
        },
        {
            "label": "Blood Pincer",
            "value": "blood-pincer",
            "score": 5
        },
        {
            "label": "Three Blood Spot Card",
            "value": "3-blood-spot-card",
            "score": 10
        },
        {
            "label": "Empty Blood Spot Card",
            "value": "empty-blood-spot-card",
            "score": 15
        },
        {
            "label": "Pricking Finger Procedure",
            "value": "pricking-finger-proc",
            "score": 5
        },
        {
            "label": "Blood Collection Process",
            "value": "blood-collection-proc",
            "score": 30
        },
        {
            "label": "Filled Blood Spot Card",
            "value": "filled-blood-spot-card",
            "score": 10
        },
        {
            "label": "Sealed Blood Sample Package",
            "value": "sealed-blood-sample-package",
            "score": 10
        },
        {
            "label": "Blood Spot Sample Bag",
            "value": "blood-spot-sample-bag",
            "score": 5
        },
        {
            "label": "Shipping Barcode Scanned During Recording",
            "value": "fedex-barcode",
            "score": 10
        }
    ],
    "a0qHt00000C8NptIAF": [
        {
            "label": "Sealed Urine Cup",
            "value": "sealed-urine-cup",
            "score": 5
        },
        {
            "label": "Unsealed Urine Cup",
            "value": "open-urine-cup",
            "score": 5
        },
        {
            "label": "Empty Urine Cup",
            "value": "empty-urine-cup",
            "score": 5
        },
        {
            "label": "Empty Vacutainer Tube",
            "value": "empty-urine-tube",
            "score": 10
        },
        {
            "label": "Urine Cup Filled Prior to Collection",
            "value": "filled-urine-cup",
            "score": 10
        },
        {
            "label": "Properly Filled Each Vacutainer Tube",
            "value": "filled-urine-tube",
            "score": 10
        },
        {
            "label": "Sealed and Signed / Dated All Vials",
            "value": "sealed-urine-tube",
            "score": 10
        },
        {
            "label": "Empty Specimen Bag",
            "value": "sample-bag-empty",
            "score": 10
        },
        {
            "label": "Placed All Vials in Specimen Bag and Sealed Specimen Bag",
            "value": "sample-bag-filled",
            "score": 10
        },
        {
            "label": "Shipping Barcode Scanned During Recording",
            "value": "fedex-barcode",
            "score": 10
        }
    ],
    "a0q2J00000BMfozQAD": [
        {
            "label": "Ten Finger View",
            "value": "ten-finger-view",
            "score": 10
        },
        {
            "label": "Sealed Nail Cutter",
            "value": "sealed-nail-cutter",
            "score": 10
        },
        {
            "label": "Open Nail Cutter",
            "value": "open-nail-cutter",
            "score": 10
        },
        {
            "label": "Nail Cutter",
            "value": "nail-cutter",
            "score": 10
        },
        {
            "label": "Cutting Nail Procedure",
            "value": "cutting-nail-proc",
            "score": 50
        },
        {
            "label": "Sealed Nail Sample",
            "value": "sealed-nail-sample",
            "score": 10
        },
        {
            "label": "Empty Sample Bag",
            "value": "sample-bag-empty",
            "score": 5
        },
        {
            "label": "Filled Sample Bag",
            "value": "sample-bag-filled",
            "score": 10
        },
        {
            "label": "Shipping Barcode Scanned During Recording",
            "value": "fedex-barcode",
            "score": 10
        }
    ],
    "a0qPI0000040W7GYAU": [
        {
            "label": "Ten Finger View",
            "value": "ten-finger-view",
            "score": 10
        },
        {
            "label": "Sealed Nail Cutter",
            "value": "sealed-nail-cutter",
            "score": 10
        },
        {
            "label": "Open Nail Cutter",
            "value": "open-nail-cutter",
            "score": 10
        },
        {
            "label": "Nail Cutter",
            "value": "nail-cutter",
            "score": 10
        },
        {
            "label": "Cutting Nail Procedure",
            "value": "cutting-nail-proc",
            "score": 50
        },
        {
            "label": "Sealed Nail Sample",
            "value": "sealed-nail-sample",
            "score": 10
        },
        {
            "label": "Empty Sample Bag",
            "value": "sample-bag-empty",
            "score": 5
        },
        {
            "label": "Filled Sample Bag",
            "value": "sample-bag-filled",
            "score": 10
        },
        {
            "label": "Shipping Barcode Scanned During Recording",
            "value": "fedex-barcode",
            "score": 10
        }
    ]
}

const scoreMatrixSlice = createSlice({
    name: "scoreMatrix",
    initialState,
    reducers: {
        setScore: (state, action: PayloadAction<PayloadType>) => {
            const aiItem = state[action.payload.label]?.[action.payload.index];
            if (aiItem) {
                aiItem.score = action.payload.score;
            }
        },
    }
});

export const scoreMatrix = (state: { scoreMatrix: ScoreMatrix }) => state.scoreMatrix

export const { setScore } = scoreMatrixSlice.actions

export default scoreMatrixSlice.reducer;