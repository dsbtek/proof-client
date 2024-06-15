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

export const proofPassData = [
  {
    id: 1,
    submitted_on: "05/03/2024 10:19 AM EST",
    service: "Proof collection",
    result: "Pending",
    panel: "",
    donorParticipantId: "8554443303",
    dateOfService: "05/03/2024",
    identity: "Not Applicable",
    collection: "Not Applicable",
  },
  {
    id: 2,
    submitted_on: "05/03/2024 10:19 AM EST",
    service: "Proof collection",
    result: "Positive",
    panel: "Panel",
    donorParticipantId: "8554443303",
    dateOfService: "05/03/2024",
    identity: "Not Applicable",
    collection: "Not Applicable",
  },
  {
    id: 3,
    submitted_on: "05/03/2024 10:19 AM EST",
    service: "Proof collection",
    result: "Inconclusive",
    panel: "Panel",
    donorParticipantId: "8554443303",
    dateOfService: "05/03/2024",
    identity: "Not Applicable",
    collection: "Not Applicable",
  },
  {
    id: 4,
    submitted_on: "05/03/2024 10:19 AM EST",
    service: "Proof collection",
    result: "Negative",
    panel: "",
    donorParticipantId: "8554443303",
    dateOfService: "05/03/2024",
    identity: "Not Applicable",
    collection: "Not Applicable",
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
