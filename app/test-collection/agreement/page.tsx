"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import { AgreementHeader, AgreementFooter, AppHeader, Header, DesktopFooter } from "@/components";
import { authToken } from "@/redux/slices/auth";
import { testingKit, testData, setTestSteps } from "@/redux/slices/drugTest";
import { preTestScreensData, preTestFeedbackData, setPreTestFeedback } from "@/redux/slices/pre-test";
import { decryptIdAndCredentials } from "@/utils/utils";
import { initializeAI } from "@/utils/queries";
import { RxSpeakerLoud } from "react-icons/rx";
import { GoMute } from "react-icons/go";
import useResponsive from "@/hooks/useResponsive";

interface PreTestScreen {
  Screen_1_Title: string;
  Screen_1_Content: string;
}

const AgreementConsent = () => {
  const dispatch = useDispatch();
  const { participant_id, pin } = useSelector(authToken);
  const { kit_id, Feedback_Questionnaire_Name } = useSelector(testingKit);
  const { testSteps, testStepsFiltered } = useSelector(testData);
  const preTestScreens = useSelector(preTestScreensData) as PreTestScreen[];
  const preTestFeedback = useSelector(preTestFeedbackData) as PreTestScreen[];
  const isDesktop = useResponsive()

  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const [statusCode, setStatusCode] = useState(0);

  const { isLoading, isStale, refetch } = useQuery(
    `test-data: ${kit_id}`,
    async () => {
      initializeAI();
      const response = await fetch("/api/drug-kit-details", {
        method: "POST",
        headers: {
          participant_id: participant_id as string,
          pin: pin as string,
          kit_id: kit_id,
        },
      });
      const data = await response.json();
      return data;
    },
    {
      enabled: false,
      onSuccess: ({ data }) => {
        if (data.statusCode === 200) {
          setStatusCode(data.statusCode);
          dispatch(setTestSteps(data.test_steps));
        } else {
          toast.warn("Failed to load test data. Please try again");
          console.error(`Error ${data.statusCode}: ${data.message}`);
        }
      },
      onError: (error) => {
        toast.error("Sorry, test data failed to load");
        console.error(error);
      },
    }
  );

  const getFeedback = useCallback(
    async (kitFeedbackQuestion: string) => {
      try {
        const participant_id = localStorage.getItem("participant_id");
        const pin = localStorage.getItem("pin");
        const { strParticipantId, strPin } = decryptIdAndCredentials(participant_id, pin);
        const response = await fetch("/api/pre-test-questionnaire", {
          method: "POST",
          headers: {
            participant_id: strParticipantId,
            pin: strPin,
            form_name: kitFeedbackQuestion,
          },
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(setPreTestFeedback(data.data.sections));
        } else {
          console.log("Error submitting data");
        }
      } catch (error) {
        toast.warning(`Error: ${error}`);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (testSteps.length === 0 && testStepsFiltered.length === 0 && isStale) {
      refetch();
    }
    if (Feedback_Questionnaire_Name) {
      getFeedback(Feedback_Questionnaire_Name);
    }
  }, [Feedback_Questionnaire_Name, getFeedback, isLoading, isStale, refetch, testSteps, testStepsFiltered.length]);

  const toggleMute = () => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };

  const renderAgreementContent = () => (
    <div className="agreement-container">
      {!isDesktop?

      <AgreementHeader title="Agreement & Consent " />:

      <Header
        title="Agreement & Consent"
        icon={
          muted ? (
            <GoMute onClick={toggleMute} color="#adadad" style={{ cursor: "pointer" }} />
          ) : (
            <RxSpeakerLoud onClick={toggleMute} color="#009cf9" style={{ cursor: "pointer" }} />
          )
        }
      />}
      <div className="agreement-items-wrap scroller">
        <p>
          <b>PROOF™ User Agreement</b>
        </p>
        <br />
        <br />
        <p>
          By clicking to continue, you are electronically signing this PROOF™ User Agreement (“PUA”). You are receiving data integration into the PROOF™ Mobile Application for test collection and results and posting those test results in the PROOF™ Mobile Application software platform. This agreement is between the User (person using the PROOF™ Mobile Application) and PROOF™ and includes data integration with PROOF™ Mobile Application.
          <br />
          <br />
          By your acceptance of this PROOF™ User Agreement (PUA), you agree to be held by this PUA and PROOF™’s General Terms and Conditions, which are available within the application (collectively, the “Contract”). To the extent any term or condition of this PUA conflicts with the General Terms and Conditions, the terms of this PUA shall govern.
          <br />
          <br />
          You represent that you are legally authorized to enter into the Contract, and that you are solely responsible for the payment of testing fees. You accept the Contract by doing any of the following: (a) your completion of this PUA; (b) giving us a written or electronic signature; (c) completing an online registration that we accept; (d) activating or using the service; (f) making a change or addition to service; or (g) paying any testing fees.
          <br />
          <br />
          The parties hereto agree that reports prepared and issued by the testing kit manufacturer(s) are the sole responsibility of the issuer, and that PROOF™ assumes no responsibility for such reports. PROOF™ assumes no liability for the accuracy of the processed data; however, every precaution will be taken to ensure its accuracy. PROOF™ is not liable for reasonable delays in performing under this Agreement due to disaster, weather, or mechanical failure.
          <br />
          <br />
          User agrees to indemnify and hold harmless PROOF™, its directors, officers and employees from and against any and all claims, actions, and liabilities of any nature, which may be asserted against it or them in connection with the performance of PROOF™, its directors, officers, employees, and agents pursuant to this Agreement.
          <br />
          <br />
          This PROOF™ User Agreement shall be governed and construed in accordance with the laws of the Commonwealth of Virginia, and shall remain in effect until either the Agreement between PROOF™ and the user is canceled, or the User confirms in writing to PROOF™ that User is no longer interested in continuing the PROOF™ User Agreement and related services.
          <br />
          <br />
          <b>Privacy</b>
          <br />
          <br />
          PROOF™ is strongly committed to maintaining the privacy of your personal information and the security of our technology systems. With respect to the collection, use and disclosure of personal information, we make every effort to ensure compliance with applicable Federal law. We will never sell, rent, or distribute any email addresses or personal information. PROOF™ ensures the confidentiality, integrity, permissible use, and availability of all personal information we create, receive, maintain or transmit. This includes full compliance by our workforce.
          <br />
          <br />
          User authorizes PROOF™ to share your information, including the results of any tests, with treatment Programs and/or authorized contacts. User may revoke this authorization at any time, which will terminate upon written notice to PROOF™ that the entire agreement has been terminated.
          <br />
          <br />
          <b>Testing Responsibilities</b>
          <br />
          <br />
          For app use, you are certifying that you have followed all instructions and have washed your hands with soap and water prior to beginning the test.
          <br />
          <br />
          You are certifying that you will look directly at the smartphone so that your head and face and workspace are within the ‘guide’ on the screen during the entire test process, along with keeping all testing supplies in clear view of the camera.
          <br />
          <br />
          You will not wear anything on your face or head that would obstruct the camera or your photo during the test.
          <br />
          <br />
          You will not attempt to falsify the test or use any additional devices or assistance from other people to provide the device with a false reading.
          <br />
          <br />
          If you are collecting Oral Fluid, you are certifying that you have not smoked, vaped, or had tobacco of any kind, nor ingested any food, drink, including mouthwash, candy, spray, or drugs, for a minimum of 20 minutes before the test begins.
          <br />
          <br />
          <b>Biometric Data</b>
          <br />
          <br />
          PROOF™ (“PROOF™“, “we“, “us“, “our“) has instituted the following policy related to any biometric data that PROOF™ possesses as a result of our customers’ and their end users’ use of PROOF™ services. Our customers are responsible for developing and complying with their own biometric data retention and destruction policies as may be required under applicable law. As pertaining to biometric data processed by us, they have committed to us that they will do so in a manner consistent with this policy.
          <br />
          <br />
          <b>Definition of Biometric Data</b>
          <br />
          <br />
          As used in this policy, biometric data includes “biometric identifiers” and “biometric information” as defined in the Illinois Biometric Information Privacy Act (“BIPA”), 740 ILCS § 14/1, et seq.
          <br />
          <br />
          “Biometric identifier” means a retina or iris scan, fingerprint, voiceprint, or scan of hand or face geometry. Biometric identifiers do not include writing samples, written signatures, photographs, human biological samples used for valid scientific testing or screening, demographic data, tattoo descriptions, or physical descriptions such as height, weight, hair color, or eye color. Biometric identifiers do not include information captured from a patient in a health care setting or information collected, used, or stored for health care treatment, payment, or operations under the federal Health Insurance Portability and Accountability Act of 1996.
          <br />
          <br />
          “Biometric information” means any information, regardless of how it is captured, converted, stored, or shared, based on an individual’s biometric identifier used to identify an individual. Biometric information does not include information derived from items or procedures excluded under the definition of biometric identifiers.
          <br />
          <br />
          <b>PROOF™ Collection and Use of Biometric Information</b>
          <br />
          <br />
          PROOF™ provides ID verification services to our customers. In order to provide these services, PROOF™ collects images of your identification documents using PROOF™ systems and technologies.
          <br />
          <br />
          PROOF™ software tools detect, verify and analyze biometric information included on a government-issued identity documents to provide ID verification and fraud detection. PROOF™ software uses biometric data solely to provide ID verification and fraud prevention services to the PROOF™ customer.
          <br />
          <br />
          PROOF™ will not sell, lease, trade, or otherwise profit from biometric data; provided, however, that PROOF™ may be paid for products or services provided by PROOF™ that utilize such biometric data.
          <br />
          <br />
          <b>PROOF™ Disclosure of Biometric Data and Customer Obligations to Obtain Consent</b>
          <br />
          <br />
          PROOF™ will not disclose or disseminate any such biometric data to anyone other than the PROOF™ customer to whom PROOF™ is providing products and services using biometric data, unless (i) disclosure is required by law or municipal ordinance, or (ii) disclosure is required pursuant to a valid warrant or subpoena issued by a court of competent jurisdiction.
          <br />
          <br />
          PROOF™ customers will have access to the biometric information collected on their behalf. PROOF™ customers are responsible for compliance with applicable law governing any collection, storage, use, and/or transmission of biometric data they conduct or facilitate, including biometric data captured by PROOF™ in the course of providing our services to the customer, PROOF™ customers may have their own policies that apply to their collection and use of your biometric data.
          <br />
          <br />
          <b>Data Storage and Retention</b>
          <br />
          <br />
          PROOF™ shall use a reasonable standard of care to store, transmit and protect from disclosure any paper or electronic biometric data collected. Such storage, transmission, and protection from disclosure shall be performed in a manner that is the same as or more protective than the manner in which PROOF™ transmits and protects from disclosure other confidential and sensitive information of PROOF™ and its employees.
          <br />
          <br />
          PROOF™ will delete and clear all PROOF™ Identity Profiles (PIP) annually. If continued testing occurs, you will be asked to set up PIP again.
          <br />
          <br />
          <b>Release and Consent</b>
          <br />
          <br />
          As part of our PROOF™ Identity Profile (PIP) verification process, you are providing your electronic signature acknowledging that you have read this policy, and that you voluntarily consent to our collection, storage, and use of biometric data, including to the extent that it utilizes your biometric identifiers or biometric information as defined in policy, and you voluntarily consent to providing the biometric data to PROOF™.
          <br />
          <br />
          You understand that you are free to decline to provide biometric identifiers and biometric information to PROOF™, however, we are not able to provide certain identification verification services unless you consent and make information available to PROOF™ in accordance with this Policy. You may revoke this consent at any time by emailing us at proof@recoverytrek.com (you will not be able to proceed with PROOF™).
        </p>
        {/* <audio ref={audioRef} src="https://rt-mobiletrekvideos.s3.amazonaws.com/consent+and+accept.mp3" controls={false} autoPlay /> */}
      </div>
      <br /> <br />
      {isDesktop?
      <DesktopFooter
        currentNumber={1}
        outOf={4}
        onPagination={true}
        onLeftButton={true}
        onRightButton={true}
        btnLeftLink="/home"
        btnRightLink={isLoading ? "" : "/test-collection/signature"}
        btnLeftText="Decline"
        btnRightText={isLoading ? "loading..." : "Accept"}
        rightdisabled={isLoading || statusCode !== 200}
      />:
      <AgreementFooter
        currentNumber={1}
        outOf={4}
        onPagination={true}
        onLeftButton={true}
        onRightButton={true}
        btnLeftLink="/home"
        btnRightLink={isLoading ? "" : "/test-collection/signature"}
        btnLeftText="Decline"
        btnRightText={isLoading ? "loading..." : "Accept"}
        rightdisabled={isLoading || statusCode !== 200}
      />
    }
    </div>
  );

  const renderCustomContent = (title: string, content: string) => (
    <>
      <AgreementHeader title={title} />
      <div className="agreement-items-wrap scroller">
        <p>{content}</p>
      </div>
      {isDesktop?
      <DesktopFooter
        currentNumber={1}
        outOf={4}
        onPagination={true}
        onLeftButton={true}
        onRightButton={true}
        btnLeftLink="/home"
        btnRightLink={isLoading ? "" : "/test-collection/signature"}
        btnLeftText="Decline"
        btnRightText={isLoading ? "Loading..." : "Accept"}
        rightdisabled={isLoading || statusCode !== 200}
      />:
      <AgreementFooter
        currentNumber={1}
        outOf={4}
        onPagination={true}
        onLeftButton={true}
        onRightButton={true}
        btnLeftLink="/home"
        btnRightLink={isLoading ? "" : "/test-collection/signature"}
        btnLeftText="Decline"
        btnRightText={isLoading ? "Loading..." : "Accept"}
        rightdisabled={isLoading || statusCode !== 200}
      />
}
    </>
  );

  return (
    <div className="">
      {preTestScreens[0]?.Screen_1_Title !== "Agreement and Consent"
        ? renderAgreementContent()
        : renderCustomContent(preTestScreens[0].Screen_1_Title, preTestScreens[0].Screen_1_Content)
      }
      <audio ref={audioRef} autoPlay muted={muted} controls={false}>
        <source src="https://rt-mobiletrekvideos.s3.amazonaws.com/consent+and+accept.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AgreementConsent;