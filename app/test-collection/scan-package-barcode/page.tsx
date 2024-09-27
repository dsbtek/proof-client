"use client";
import { AgreementHeader, Scanner } from "@/components";
import { testingKit } from "@/redux/slices/drugTest";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function ScanPakageBarcode() {
  const [showBCModal, setShowBCModal] = useState<boolean>(true);
  const [barcodeUploaded, setBarcodeUploaded] = useState<boolean>(true);
  const { kit_id, } = useSelector(testingKit);
  const router = useRouter();
  const preTestQuestionnaire = useSelector(
    (state: any) => state.preTest.preTestQuestionnaire
  );

  const closeBCModal = () => {
    setShowBCModal(false);
    setBarcodeUploaded(false);
    if (preTestQuestionnaire && preTestQuestionnaire?.length > 0) {
      router.push("/pre-test-questions");
    } else {
    router.push(`/test-collection/${kit_id}`);}
};


  return (

    <div className="id-detection-container_" style={{ position: "relative" }}>
      <>
        <AgreementHeader title="Kit Barcode scan" />
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          <div className="camera-wrap-desktop">
            <div className="sub-item-2">
              <h3 className="">Kit Barcode scan</h3>
              <br />
              <p className="m-5">
                Please scan the barcode on the &quot;extra label &quot; located on the end
                of the box your kit supplies were in. Barcode begins with &quot;80&quot;.
                <br />
              </p>
              <br />
              {/* <Image className='id-image-2' src='/images/proof-identity-profile.svg' alt="captured Image" width={5000} height={5000} loading='lazy' /> */}
              <br />
              <p className="vid-text m-5">
                Please ensure the barcode is withiin the guide frame.
              </p>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              right: "0",
              top: "0",
              width: "50%",
              height: "100%",
              zIndex: "1000",
            }}
          >
            <Scanner
              show={showBCModal}
              scanType="detect"
              barcodeUploaded={true}
              // step={2}
              // totalSteps={3}
              recapture={() => setShowBCModal(false)}
              closeModal={ closeBCModal}
            />
          </div>
        </div>
      </>
      {/* <DesktopFooter
        onPagination={false}
        onLeftButton={false}
        onRightButton={true}
        btnRightText={"Next"}
        onClickBtnRightAction={closeBCModal}
    /> */}
    </div>
  );
}

export default ScanPakageBarcode;
