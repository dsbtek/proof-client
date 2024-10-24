"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import {
  AppHeader,
  DesktopSwitch,
  DialogBox,
  DinamicMenuLayout,
  Switch,
} from "@/components";
import { appData } from "@/redux/slices/appConfig";
import { setKit } from "@/redux/slices/drugTest";
import { extractAndFormatPreTestScreens, setCookie } from "@/utils/utils";
import { setPreTestScreens } from "@/redux/slices/pre-test";
import useResponsive from "@/hooks/useResponsive";

const TestCollection = () => {
  const testViewCookie = Cookies.get("testView");
  const [checked, setChecked] = useState(
    testViewCookie === "true" ? true : false
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const [isGridView, setIsGridView] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [toggleSwitch, setToggleSwitch] = useState(checked);
  const isDesktop = useResponsive();

  const [pendingTest, setPendingTest] = useState<string | null>(null);
  const [pendingTestPrompt, setPendingTestPrompt] = useState<boolean>(false);

  const handleToggleGridView = (isActive: boolean) => {
    setIsGridView(true);
    setIsListView(false);
  };

  const handleToggleListView = (isActive: boolean) => {
    setIsListView(true);
    setIsGridView(false);
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
    if (pendingTest) setPendingTestPrompt(true);
  }, [pendingTest]);

  return (
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
        <AppHeader className="no-herder" title="Test/Collections" />
        <div className="views-container">
          {!isDesktop ? (
            <Switch onToggle={handleSwitch} showLabel checked={checked} />
          ) : (
            <DesktopSwitch
              title="Test/Collection"
              description="Select the test you want to perform"
              onToggleGridView={handleToggleGridView}
              onToggleListView={handleToggleListView}
            />
          )}
          <div className="grid-list">
            {toggleSwitch ? (
              <Link href={`/test-collection/${drug_kit[1].kit_id}`}>
                <div className="grid-container scroller">
                  {drug_kit !== undefined &&
                    drug_kit.map((kit: any) => (
                      <div
                        key={kit.kit_id}
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
                    ))}
                </div>
              </Link>
            ) : (
              <Link href={"/test-collection/system-check"}>
                <div className="list-container scroller">
                  {drug_kit !== undefined &&
                    drug_kit.map((kit: any) => (
                      <div
                        key={kit.kit_id}
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
                    ))}
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </DinamicMenuLayout>
  );
};

export default TestCollection;
