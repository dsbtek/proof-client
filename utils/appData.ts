//Data shown at the landing page
export const welcomeData = [
  {
    imgUri: "/images/caution.png",
    title: "Caution",
    texts: [
      "DO NOT open any PROOF supplies until you are specifically instructed to do so by the application.",
      "Set your phone to DO NOT Disturb and turn off any alarms.",
      "While using the PROOF app, DO NOT answer phone calls, text messages or close the app until instructed.",
    ],
  },
  {
    imgUri: "/images/use-phone.png",
    title: "Upload Important Data",
    texts: ["Vaccine records.", "Test results (conducted outside PROOF)."],
  },
  {
    imgUri: "/images/use-phone.png",
    title: "Specimen Collections",
    texts: [
      "Drug and Alcohol Testing (Saliva, Nail, Blood, Urine, Breath).",
      "COVID-19 Testing (Nasal, Saliva).",
      "Wellness / Diagnostics.",
    ],
  },
];

export const proofPassFilter = [
  {
    id: 1,
    value: "Drug Test Results",
    label: "Drug Test Results",
  },
  {
    id: 2,
    value: "OralTox Kit Test",
    label: "OralTox Kit Test",
  },
  {
    id: 3,
    value: "PROOF Collection",
    label: "PROOF Collection",
  },
];

export const typeOfServices = [
  {
    id: 1,
    value: "Drug Test Results",
    label: "Drug Test Results",
  },
  {
    id: 2,
    value: "OralTox Kit Test",
    label: "OralTox Kit Test",
  },
  {
    id: 3,
    value: "PROOF Collection",
    label: "PROOF Collection",
  },
];

export const proofPassResult = [
  {
    id: 1,
    value: "Negative",
    label: "Negative",
  },
  {
    id: 2,
    value: "Positive",
    label: "Positive",
  },
  {
    id: 3,
    value: "Pending",
    label: "Pending",
  },
  {
    id: 4,
    value: "Inconclusive",
    label: "Inconclusive",
  },
];

// All Permissions available in the app
export const permissions = [
  "Admin",
  "Monitoring",
  "2FA",
  "Pr Breath Tutorial Video",
  "Pr Blood(opAns) Tutorial Video",
  "Honor FAQ",
  "Honor Testing Tutorial",
  "CRL FAQ",
  "CRL Whats New",
  "CRL Kit Tutorial/Overview",
  "Saved Video History",
  "NO ID",
  "PROOFpass COVID-19 Test Results",
  "PROOFpass COVID-19 Vaccination Card",
  "PROOFpass Exemptions(From Testing)",
  "PROOFpass TSquare Testing",
  "PROOFpass Pending",
  "PROOFpass App Tutorial",
  "COVID-19 Rapid Test Tutorial",
  "COVID-19 Rapid Test Tutorial en Espanol",
  "Show Rapid Results Reader",
  "BACvideo",
  "Video Tutorial",
  "Detect Kit",
  "Hide Rapid Result Status",
  "2SAN PROOFpass",
  "Priscription",
  "Hide Welcome Screen",
  "Show Change Pin Setting",
  "ID Capture with Rear Camera",
  "2SAN FAQ",
  "Disable_BAC_Light_Detector",
  "Edit OralTox Results",
  "Skyn",
  "Pr Whole Blood Tutorial Video",
  "Language French",
  "Alcohol BAC test",
  "PROOFPass",
  "Test",
  "Tutorial",
  "UploadPROOFpass",
  "PROOFpass Drug Test Results",
  "PROOF_ID",
  "PROOF Welcome Video",
  "Pr Urine Tutorial Video",
  "Pr Saliva Tutorial Video",
  "PROOF FAQ",
  "PROOF Whats New",
  "PROOFpass OralTox",
  "Pr Nail Tutorial Video",
  "Pr Blood Tutorial Video",
  "New App Features Tutorial",
  "PROOFpass PROOF Collection",
];

// Object mapping of test kits and their respective IDs
interface TestKitMapping {
  [key: string]: string;
}

export const testMapping: TestKitMapping = {
  'a0qPI000003Ud8gYAC': 'DEMO Pr Blood Kit',
  'a0q2J00000BM9IDQA1': 'DEMO Pr Saliva Kit (Intercept)',
  'a0q2J00000BMfozQAD': 'Pr Nail Kit',
  'a0qPI000003EYZcYAO': 'DEMO Pr Dual Rapid Saliva Kit (OralTox/ALCO)',
  'a0q2J00000BMNJoQAP': 'CRL Saliva Kit',
  'a0qPI000003BM8OYAW': 'Pr Dual Rapid Saliva Kit (OralTox/ALCO)',
  'a0qHt00000C8ETwIAN': '2SAN Home Drug Test Collection & Result Recording',
  'a0q2J00000Ciy3bQAB': 'Pr Saliva Kit (DOCTox Quantisal)',
  'a0q2J00000A07UpQAJ': 'DOCTox-Quantisal-Spanish',
  'a0q2J00000ANlwbQAD': 'DOCtox-Quantisal-Caregiver Assisted',
  'a0q2J00000Cj7WGQAZ': 'CRL Saliva & Blood Kit',
  'a0qPI000004WV6PYAW': 'FRENCH Pr Dual Rapid Saliva Kit (OralTox/ALCO)',
  'a0qHt00000C8KsdIAF': 'Laboratory Confirmation (Optional)',
  'a0qHt00000C8B8gIAF': 'NO ID Pr Blood Kit',
  'a0qHt00000C8NptIAF': 'Pr Urine Kit',
  'a0qPI000003GXkgYAG': 'Pr Whole Blood Kit',
  'a0qHt00000AiRGcIAN': 'INACTIVE-Pr Rapid Saliva Kit (Honor)',
  'a0qPI0000040W7GYAU': 'DEMO PR Nail Kit'
};

