"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { testData, testingKit } from "@/redux/slices/drugTest";
import { AgreementHeader, AgreementFooter, AppHeader, AppContainer, AppHeaderDesktop, Timer } from "@/components";
import useResponsive from "@/hooks/useResponsive";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const OralTox = () => {
    const DEFAULT_TIMER = 10;
    const { timerObjs } = useSelector(testData);
    const [showTimer, setShowTimer] = useState<boolean>(true);
    const [time, setTime] = useState<number>(timerObjs[0]?.step_time || DEFAULT_TIMER);
    const [stopTimer, setStopTimer] = useState(false);
    const router = useRouter();
    const isDesktop = useResponsive();
    const kitName = useSelector(testingKit);

    useEffect(() => {
        if (stopTimer) return;
        const initialTime = timerObjs[0]?.step_time || DEFAULT_TIMER;
        setTime(initialTime);

        const timer = setTimeout(() => {
            setShowTimer(false);
            setStopTimer(true);
            router.push("/test-collection/rapid-test/oraltox/oraltox-detection");
        }, initialTime * 1000);

        return () => clearTimeout(timer);
    }, [stopTimer, timerObjs, router]);

    return (
        <AppContainer
            header={<AppHeader title={kitName.kit_name} hasMute={false} />}
            body={
                !isDesktop ? (
                    <div className="agreement-items-wrap">
                        <Image className="get-started-img" src="/images/oraltox-img-m.svg" alt="alco-test" width={3000} height={3000} />
                        <p className="alco-text-title">Instructions:</p>
                        <p className="with-bullet">Place the test device on a solid color background.</p>
                        <p className="with-bullet">Use the silhouette on your screen and align the device properly within the silhouette.</p>
                        {showTimer && (
                          <div
                            style={{
                              display: "flex",
                              height: "50%",
                              width: "100%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Timer
                              time={time}
                              showTimer={showTimer}
                              handleEnd={()=> {}}
                            />
                          </div>
                        )}
                    </div>
                ) : (
                    <div className="test-items-wrap-desktop_">
                        <div className="sub-item">
                            <p className="alco-text-title">Instructions:</p>
                            <p className="with-bullet">Place the test device on a solid color background.</p>
                            <p className="with-bullet">Use the silhouette on your screen and align the device properly within the silhouette.</p>
                         {showTimer && (
                            <div
                              style={{
                                display: "flex",
                                height: "50%",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Timer
                                time={time}
                                showTimer={showTimer}
                                handleEnd={()=> {}}
                              />
                            </div>
                          )}
                        </div>
                        <div
                            className="wrap-img"
                            style={{
                                backgroundImage: "url('/images/oraltox-img.svg')",
                            }}
                        />
                    </div>
                )
            }
            footer={
                <AgreementFooter
                    currentNumber={3}
                    outOf={4}
                    onPagination={false}
                    onLeftButton={false}
                    onRightButton={true}
                    btnLeftLink={""}
                    btnRightLink={"/test-collection/rapid-test/oraltox/oraltox-detection"}
                    btnLeftText={"Decline"}
                    rightdisabled={!stopTimer}
                    btnRightText={"Continue"}
                />
            }
        />
    );
};

export default OralTox;
