"use client";

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from 'next/image';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { AppHeader, DesktopSwitch, DinamicMenuLayout, Switch } from "@/components";
import { appData } from "@/redux/slices/appConfig";
import { setKit } from "@/redux/slices/drugTest";
import { extractAndFormatPreTestScreens, setCookie } from "@/utils/utils";
import { setPreTestScreens } from '@/redux/slices/pre-test';

const TestCollection = () => {
  const testViewCookie = Cookies.get("testView");
  const [checked, setChecked] = useState(testViewCookie === 'true');
  const router = useRouter();
  const dispatch = useDispatch();
  const [isGridView, setIsGridView] = useState(false);
  const [isListView, setIsListView] = useState(true);
  const [toggleSwitch, setToggleSwitch] = useState(checked);

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
    setCookie('testView', newChecked.toString(), 2000);
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
      const screenWidth = window.innerWidth;

      setToggleSwitch(checked);
      if (screenWidth <= 700) {
        setToggleSwitch(checked);
      } else {
        setToggleSwitch(isListView);
      }
    };

    routeBasedOnScreenSize();
    window.addEventListener('resize', routeBasedOnScreenSize);
    return () => window.removeEventListener('resize', routeBasedOnScreenSize);
  }, [checked, isListView]);

  return (
    <DinamicMenuLayout>
      <div className="container-test-collection">
        <AppHeader className="no-herder" title="Test/Collections" />
        <div className="views-container">
          <Switch onToggle={handleSwitch} showLabel checked={checked} />
          <DesktopSwitch
            title="Test/Collection"
            description="Select the test you want to perform"
            onToggleGridView={handleToggleGridView}
            onToggleListView={handleToggleListView}
          />
          <div className="grid-list">
            {toggleSwitch ? (
              <Link href={"/test-collection/system-check"}>
                <div className="grid-container scroller">
                  {drug_kit !== undefined && drug_kit.map((kit: any) => (
                    <div key={kit.kit_id} className="wrap-grid-items" onClick={() => handleKitClick(kit)}>
                      <div className="grid-img-wrap">
                        <Image className="grid-img" src={kit.kit_image} width={5000} height={5000} alt="proof image" loading="lazy" />
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
                  {drug_kit !== undefined && drug_kit.map((kit: any) => (
                    <div key={kit.kit_id} className="list-card" onClick={() => handleKitClick(kit)}>
                      <Image src={kit.kit_image} alt="proof image" width={5000} height={5000} className="list-img" loading="lazy" />
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
