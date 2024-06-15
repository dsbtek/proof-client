"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import { AgreementHeader, AgreementFooter } from "@/components";
import { authToken } from "@/redux/slices/auth";
import { testingKit, testData, setTestSteps } from "@/redux/slices/drugTest";

const AgreementConsent = () => {
  const dispatch = useDispatch();
  const { participant_id, pin } = useSelector(authToken);
  const { kit_id } = useSelector(testingKit);
  const { testSteps, testStepsFiltered } = useSelector(testData);



  const { isLoading, isStale, refetch } = useQuery(`test-data: ${kit_id}`, {
    queryFn: async () => {
      const response = await fetch("/api/drug-kit-details", {
        method: 'POST',
        headers: {
          participant_id: participant_id as string,
          pin: pin as string,
          kit_id: kit_id
        }
      })
      const data = await response.json();
      return data;
    },
    enabled: false,
    onSuccess: ({ data }) => {
      const { test_steps } = data;
      if (data.statusCode === 200) {
        dispatch(setTestSteps(test_steps));
      } else {
        console.error(`Error ${data.statusCode}: ${data.message}`);
      }
    },
    onError: (error) => {
      toast.error("Sorry Test data failed to load");
      console.error(error)
    }
  });

  useEffect(() => {
    if (testSteps.length === 0 && testStepsFiltered.length === 0 && isStale) {
      refetch();
    }
  }, [isLoading, isStale, refetch, testSteps, testStepsFiltered.length]);

  return (
    <div className="container-test-collection">
      <AgreementHeader title={"Agreement & Consent"} />
      <div className="agreement-items-wrap scroller">
        <p className="agreement-header-title">
          PROOF™ User Agreement
        </p>
        <br />
        <p>
          By clicking to continue, you are electronically signing this PROOFT™ User Agreement (`PUA`). You are receiving data integration into the PROOF™™ Mobile Application for test collection and results and posting those test results in the PROOF™™ Mobile Application software platform. This agreement is between the User (person using the PROOFT™ Mobile Application) and PROOF™™ and includes data integration with PROOF™™ Mobile Application.
          <br />
          <br />
          By your acceptance of this PROOFT™ User Agreement (PUA), you agree to be held by this PUA and PROOFTM`S General Terms and Conditions, which are available within the application (collectively, the `Contract`). To the extent any term or condition of this PUA conflicts with the General Terms and Conditions, the terms of this PUA shall govern.
          You represent that you are legally authorized to enter into the Contract, and that you are solely responsible for the payment of testing fees. You accept the Contract by doing any of the following: (a) your completion of this PUA; (b) giving us a written or electronic signature;
        </p>
        <p>
          By your acceptance of this PROOF™™ User Agreement (PUA), you agree to be held by this PUA and PROOFTM`s General Terms and Conditions, which are available within the application (collectively, the `Contract`). To the extent any term or condition of this PUA conflicts with the General Terms and Conditions, the terms of this PUA shall govern. <br /> <br />
          You represent that you are legally authorized to enter into the Contract, and that you are solely responsible for the payment of testing fees. You accept the Contract by doing any of the following: (a) your completion of this PUA; (b) giving us a written or electronic signature; completing an online registration that we accept; (d) activating or using the service; (f) making a change or addition to service; or (g) paying any testing fees.  <br /> <br />
          The parties hereto agree that reports prepared and issued by the testing kit manufacturer(s) are the sole responsibility of the issuer, and that PROOF™™ assumes no responsibility for such reports. PROOF™™ assumes no liability for the accuracy of the processed data; however, every precaution will be taken to ensure its accuracy. PROOF™™ is not liable for reasonable delays in performing under this Agreement due to disaster, weather, or mechanical failure.
        </p>
      </div>
      <AgreementFooter currentNumber={1} outOf={4} onPagination={true} onLeftButton={true} onRightButton={true} btnLeftLink={"/home"} btnRightLink={isLoading ? "" : "/test-collection/signature"} btnLeftText={"Decline"} btnRightText={isLoading ? "loading..." : "Accept"} rightdisabled={isLoading} />
    </div>
  );
};

export default AgreementConsent;