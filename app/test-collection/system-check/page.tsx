"use client";

import { useCallback, useEffect, useState } from "react";
import { useBattery } from 'react-use';
import Image from "next/image";

import { AgreementHeader, AppHeader, Button, DesktopFooter, Menu, MiniLoader } from "@/components";
import { checkAvailableStorage, decryptIdAndCredentials, checkSignalStrength, /*FastTest,*/ generateSystemChecks, removeSkipQuestions } from "@/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { testingKit } from "@/redux/slices/drugTest";
import { toast } from "react-toastify";
import { setPreTestQuestionnaire } from "@/redux/slices/pre-test";
import useResponsive from "@/hooks/useResponsive";


const SystemCheck = () => {
  const battery = useBattery();
  const dispatch = useDispatch();
  const isDesktop = useResponsive()

  const deviceBatteryLevel = battery.isSupported && battery.fetched ? parseFloat((battery.level * 100).toFixed(0)) : 0;
  const [storageLevel, setStorageLevel] = useState<number>(0);
  const [internetSpeed, setInternetSpeed] = useState("0kb/0kb");
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [checkIfCalled, setCheckedIfCalled] = useState(false);
  const { Pre_Test_Questionnaire_Name } = useSelector(testingKit);
  const [effectiveBandwidth, setEffectiveBandwidth] = useState(0);
  const [systemChecks, setSystemChecks] = useState([
    {
      imgUrl: '',
      title: "Battery Life is at least 50%",
      subTitle: "pending...",
      status: 'fail',
    },
    {
      imgUrl: '',
      title: "At least 1GB of storage available",
      subTitle: "pending...",
      status: 'fail',
    },
    {
      imgUrl: '',
      title: "Strong network signal",
      subTitle: "pending...",
      status: 'fail',
    },
  ]);
  const fetchPreTestQuestionnaire = useCallback(async () => {
    setCheckedIfCalled(true)
    try {
      const participant_id = localStorage.getItem("participant_id");
      const pin = localStorage.getItem("pin");
      const { strParticipantId, strPin } = decryptIdAndCredentials(participant_id, pin)
      const response = await fetch("/api/pre-test-questionnaire", {
        method: 'POST',
        headers: {
          participant_id: strParticipantId, pin: strPin, form_name: Pre_Test_Questionnaire_Name
        },
      });

      if (response.ok) {
        const data = await response.json();
        // toast.success(data?.data?.message || 'An error occured')
        dispatch(setPreTestQuestionnaire(data?.data?.sections))
      } else {
        console.log("Error submitting data")
        // toast.error("Error submitting data");
      }
    } catch (error) {
      toast.warning(`Error: ${error}`);

    }
  }, [Pre_Test_Questionnaire_Name, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      const storage = await checkAvailableStorage() as unknown as number;
      setStorageLevel(storage!);

      const bandwith = await checkSignalStrength() as number;
      setEffectiveBandwidth(bandwith)

      setSystemChecks(await generateSystemChecks(deviceBatteryLevel, storageLevel, effectiveBandwidth));
    };
    fetchData();
    if (!checkIfCalled) {
      fetchPreTestQuestionnaire()
    }

  }, [deviceBatteryLevel, downloadSpeed, effectiveBandwidth, internetSpeed, storageLevel, fetchPreTestQuestionnaire, checkIfCalled]);



  return (
    <div className="system-chk-container ">
      <AgreementHeader title="System Check " />

      {/* <AppHeader title={"System Check"} /> */}
      <div className="system-check-items">
        {/* <div className="sys-chk-title">
          <h3>System Check</h3>
          <p>Please wait...</p>
        </div> */}
        {systemChecks.map((check, index) => (
          <div className="system-check-list" key={index}>
            {check.imgUrl === "" ? <MiniLoader size='40px' /> : <Image src={check.imgUrl} alt="image" width={5000} height={5000} loading='lazy' className="sys-chk-icon" />}
            <div className="wrap-title">
              <p className="system-check-title">{check.title}</p>
              {check.status === 'pass' ? (
                <p className="system-check-sub-title">{check.subTitle}</p>
              ) : (
                <p className="system-check-sub-title-check-bad">{check.subTitle}</p>
              )}
            </div>
          </div>
        ))}
        {isDesktop?
        <DesktopFooter
        currentNumber={0}
        outOf={0}
        onPagination={false}
        onLeftButton={false}
        onRightButton={true}
        btnLeftText=""
        btnRightText="Next"
        btnRightLink={"/test-collection/agreement"}
        onClickBtnLeftAction={()=>{}}
        onClickBtnRightAction={()=>{}}
      />:
        <div className="btn-system-chk" style={{ width: '95%', marginLeft: 'auto', marginRight: 'auto', marginTop: '32px' }}>
          <Button blue type="submit" link={'/test-collection/agreement'}>Next</Button>
        </div>}
      </div>
    </div>
  );
};

export default SystemCheck;

