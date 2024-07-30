"use client";

import { useSelector, useDispatch } from 'react-redux';
import { SetStateAction, useState } from 'react';
import Link from "next/link";
import Image from 'next/image';
import Cookies from "js-cookie";

import { AppHeader, Menu, Switch } from "@/components";
import { appData } from "@/redux/slices/appConfig";
import { setKit } from "@/redux/slices/drugTest";
import { extractAndFormatPreTestScreens, setCookie } from "@/utils/utils";
import { setPreTestScreens } from '@/redux/slices/pre-test';

const TestCollection = () => {
  const testViewCookie = Cookies.get("testView");
  const [checked, setChecked] = useState(testViewCookie === 'true');
  const dispatch = useDispatch();

  const handleSwitch = () => {
    if (testViewCookie === 'false') {
      setCookie('testView', 'true', 2000);
      setChecked(true);
    } else {
      setCookie('testView', 'false', 2000);
      setChecked(false);
    }
  };

  const { drug_kit } = useSelector(appData);

  const handleKitClick = (kit: SetStateAction<null>) => {
    dispatch(setKit(kit));
    dispatch(setPreTestScreens(extractAndFormatPreTestScreens(kit as any)))
  };

  return (
    <div className="container-test-collection">
      <AppHeader title="Test/Collections" />
      <div className="views-container">
        <div className="view-switch-wrap">
          <Switch
            onToggle={handleSwitch}
            showLabel
            checked={checked}
          />
        </div>
        <div className="grid-list">
          {checked ? (
            <Link href={"/test-collection/system-check"}>
              <div className="grid-container scroller">
                {drug_kit !== undefined && drug_kit.map((kit: any) => (
                  <div key={kit.kit_id} className="wrap-grid-items" onClick={() => handleKitClick(kit)}>
                    <div className="grid-img-wrap">
                      <Image className="grid-img" src={kit.kit_image} width={5000} height={5000} alt="proof image" loading='lazy' />
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
                    <Image src={kit.kit_image} alt="proof image" width={5000} height={5000} className="list-img" loading='lazy' />
                    <p>{kit.kit_name}</p>
                  </div>
                ))}
              </div>
            </Link>
          )}
        </div>
      </div>
      <Menu />
    </div>
  )
};
export default TestCollection;
