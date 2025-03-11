"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import {
  AppHeader,
  DesktopSwitch,
  DialogBox,
  DinamicMenuLayout,
  Header,
  Switch,
} from "@/components";
import {
  appData,
  setPageRedirect,
  setReDirectToBac,
  setReDirectToProofPass,
} from "@/redux/slices/appConfig";
import { setKit } from "@/redux/slices/drugTest";
import { extractAndFormatPreTestScreens, setCookie } from "@/utils/utils";
import { setPreTestScreens } from "@/redux/slices/pre-test";
import useResponsive from "@/hooks/useResponsive";
import { IoArrowBackOutline } from "react-icons/io5";
import { useCameraPermissions } from "@/hooks/useCameraPermissions";

const ScanPackageForTest = dynamic(
  () => import("@/components/scanPackageForTest"),
  { ssr: false }
);

const TestCollection = () => {
  const testViewCookie = Cookies.get("testView");
  const [checked, setChecked] = useState(
    testViewCookie === "true" ? true : false
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const [isGridView, setIsGridView] = useState(false);
  const [isListView, setIsListView] = useState(true);
  const [toggleSwitch, setToggleSwitch] = useState(checked);
  const isDesktop = useResponsive();
  const cameraPermissions = useCameraPermissions();
  const permissionsGranted = isDesktop && cameraPermissions;

  const [pendingTest, setPendingTest] = useState<string | null>(null);
  const [pendingTestPrompt, setPendingTestPrompt] = useState<boolean>(false);
  const [isScanPackageVisible, setIsScanPackageVisible] =
    useState<boolean>(true);

  const handleToggleGridView = () => {
    setIsGridView(true);
    setIsListView(false);
    setChecked(false);
  };

  const handleToggleListView = () => {
    setIsListView(true);
    setIsGridView(false);
    setChecked(true);
  };

  const handleSwitch = () => {
    const newChecked = !checked;
    setCookie("testView", newChecked.toString(), 2000);
    setChecked(newChecked);
    setToggleSwitch(newChecked);
  };

  const { drug_kit } = useSelector(appData);

  const handleKitClick = (kit: any) => {
    dispatch(setKit(kit));
    dispatch(setPreTestScreens(extractAndFormatPreTestScreens(kit)));
    dispatch(setPageRedirect("/test-collection"));
  };

  useEffect(() => {
    const routeBasedOnScreenSize = () => {
      setToggleSwitch(checked);
      if (!isDesktop) {
        setToggleSwitch(checked);
      } else {
        setToggleSwitch(isListView);
      }
    };
    routeBasedOnScreenSize();
  }, [checked, isListView, isDesktop]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPendingTest = localStorage.getItem("pendingTest");
      setPendingTest(storedPendingTest);
    }
  }, []);

  useEffect(() => {
    if (pendingTest) {
      setIsScanPackageVisible(false);
      setPendingTestPrompt(true);
    }
  }, [pendingTest]);

  const toggleScan = () => {
    setIsScanPackageVisible(true);
  };

  return (
    <>
      {isScanPackageVisible && (
        <ScanPackageForTest
          isVisible={isScanPackageVisible}
          setIsVisible={setIsScanPackageVisible}
          onClose={() => setIsScanPackageVisible(false)}
        />
      )}
      <DinamicMenuLayout>
        <DialogBox
          show={pendingTestPrompt}
          handleReject={() => router.push("/tutorial")}
          handleAccept={() => router.push("/pending-test")}
          title="Upload Pending Test"
          content1="WARNING: Upload pending test before taking new test."
          rejectText="Cancel"
          acceptText="Ok"
        />
        <div className="container-test-collection dex-container">
          <div className="views-container">
            {!isDesktop ? (
              <>
                <Header
                  title={"Test Collection"}
                  icon1={<IoArrowBackOutline size={24} />}
                  hasMute={false}
                  toggleScan={toggleScan}
                />
                <Switch
                  onToggleGridView={handleToggleGridView}
                  onToggleListView={handleToggleListView}
                  switchGridView={isGridView}
                  switchListView={isListView}
                />
              </>
            ) : (
              <DesktopSwitch
                title="Test/Collection"
                description="Select the test you want to perform"
                onToggleGridView={handleToggleGridView}
                onToggleListView={handleToggleListView}
                switchGridView={isGridView}
                switchListView={isListView}
                toggleScan={toggleScan}
              />
            )}
            <div className="grid-list">
              {isGridView ? (
                <div className="grid-container scroller-test">
                  {drug_kit !== undefined &&
                    drug_kit.map((kit: any) => (
                      <Link
                        href={"/test-collection/system-check"}
                        key={kit.kit_id}
                      >
                        <div
                          className="wrap-grid-items"
                          onClick={() => handleKitClick(kit)}
                        >
                          <div className="grid-img-wrap">
                            <Image
                              className="grid-img"
                              src={kit.kit_image}
                              width={5000}
                              height={5000}
                              alt="proof image"
                              loading="lazy"
                            />
                          </div>
                          <div className="img-title">
                            <p>{kit.kit_name}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              ) : (
                <div
                  className="list-container scroller-test"
                  style={{ paddingBottom: "200px" }}
                >
                  {drug_kit !== undefined &&
                    drug_kit.map((kit: any) => (
                      <Link
                        href={"/test-collection/system-check"}
                        key={kit.kit_id}
                      >
                        <div
                          className="list-card"
                          onClick={() => handleKitClick(kit)}
                        >
                          <Image
                            src={kit.kit_image}
                            alt="proof image"
                            width={5000}
                            height={5000}
                            className="list-img"
                            loading="lazy"
                          />
                          <p>{kit.kit_name}</p>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DinamicMenuLayout>
    </>
  );
};

export default TestCollection;
