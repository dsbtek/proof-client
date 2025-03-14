"use client";

import { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  AppHeader,
  ReadOnlyInput,
  Setting,
  Button,
  DinamicMenuLayout,
  ChangePinModal,
  Header,
} from "@/components";
import { logout } from "@/redux/slices/auth";
import { appData, appDataDump, userIdString } from "@/redux/slices/appConfig";
import { authToken } from "@/redux/slices/auth";
import { clearTestData } from "@/redux/slices/drugTest";
import useGetDeviceInfo from "@/hooks/useGetDeviceInfo";
import { GoArrowLeft } from "react-icons/go";

function Settings() {
  const [showPinModal, setShowPinModal] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const { first_name, last_name, email } = useSelector(appData);
  const { participant_id } = useSelector(authToken);
  const userId = useSelector(userIdString) ?? "/images/user-avi.png";
  const device = useGetDeviceInfo();

  const handleShowModal = () => {
    setShowPinModal(!showPinModal);
  };

  return (
    <>
      <ChangePinModal show={showPinModal} onClick={handleShowModal} />
      <DinamicMenuLayout>
        <div className="settings-container">
          <div className="personal-information-container scroller-test">
            <div className="settings-header">
              {device?.screenWidth < 700 && (
                <Header
                  title="Settings"
                  icon1={<GoArrowLeft />}
                  hasMute={false}
                />
              )}
              <Button
                classname="mobile-only logout-btn"
                onClick={() => {
                  dispatch(appDataDump());
                  dispatch(clearTestData());
                  dispatch(logout());
                  router.push("/auth/sign-in");
                }}
              >
                <Image
                  src="/icons/exit-door.svg"
                  alt="exit-icon"
                  width={20}
                  height={20}
                />
                <p>Logout</p>
              </Button>
            </div>
            <div className="dex-only title-sub-container">
              <h4 className="set-sec-title">Personal Information</h4>
              <p className="settings-title-subtext">
                You can edit your profile
              </p>
            </div>
            <div className="user-avi">
              <Image
                src={userId}
                width={3000}
                height={3000}
                alt="Proof User Avi"
                className="avi"
                loading="lazy"
              />
            </div>
            <section className="settings-section">
              <h4 className="mobile-only set-sec-title">
                Personal Information
              </h4>
              <ReadOnlyInput
                label="NAME"
                value={`${first_name} ${last_name}`}
              />
              <ReadOnlyInput label="EMAIL" value={email} />
              <ReadOnlyInput
                label="Participant ID"
                value={participant_id as string}
              />
              <Button
                blue
                classname=""
                type="submit"
                style={{
                  width: "8.5rem",
                  height: "3.1875rem",
                  fontSize: "1rem",
                }}
                onClick={handleShowModal}
              >
                Change Pin
              </Button>
            </section>
            <section className="mobile-only settings-section">
              <h4 className="set-sec-title">Account</h4>
              <Setting
                icon={
                  <Image
                    src="/icons/gear.svg"
                    alt="exit-icon"
                    width={32}
                    height={32}
                  />
                }
                title=" Application Settings"
                link="/settings/application-settings"
              />
              <Setting
                icon={
                  <Image
                    src="/icons/bust.svg"
                    alt="exit-icon"
                    width={26}
                    height={26}
                  />
                }
                title="Deactivate My Account"
                link="https://collectwithproof.com/contact-us"
                openInNewTab
              />
            </section>
            <section className="mobile-only settings-section">
              <h4 className="set-sec-title">About</h4>
              <Setting
                icon={
                  <Image
                    src="/icons/privacy.svg"
                    alt="exit-icon"
                    width={32}
                    height={32}
                  />
                }
                title="Privacy Policy"
                link="/settings/privacy-policy"
                openInNewTab
              />
              <Setting
                icon={
                  <Image
                    src="/icons/terms.svg"
                    alt="exit-icon"
                    width={32}
                    height={32}
                  />
                }
                title="Terms and Conditions"
                link="https://www.recoverytrek.com/terms-of-use"
                openInNewTab
              />
            </section>
          </div>
          {/* account settings  */}
          <div className="account-settings-container">
            <section className="settings-section">
              <div>
                <h4 className="set-sec-title">Account</h4>
                <p className="settings-title-subtext">
                  You can edit your account
                </p>
              </div>
              <Setting
                icon={
                  <Image
                    src="/icons/gear.svg"
                    alt="exit-icon"
                    width={32}
                    height={32}
                  />
                }
                title=" Application Settings"
                link="/settings/application-settings"
              />
              <Setting
                icon={
                  <Image
                    src="/icons/bust.svg"
                    alt="exit-icon"
                    width={26}
                    height={26}
                  />
                }
                title="Deactivate My Account"
                link="https://collectwithproof.com/contact-us"
                openInNewTab
              />
            </section>
            <section className="settings-section">
              <div>
                <h4 className="set-sec-title">About</h4>
                <p className="settings-title-subtext">
                  Read about our app legal terms
                </p>
              </div>
              <Setting
                icon={
                  <Image
                    src="/icons/privacy.svg"
                    alt="exit-icon"
                    width={32}
                    height={32}
                  />
                }
                title="Privacy Policy"
                link="/settings/privacy-policy"
              />
              <Setting
                icon={
                  <Image
                    src="/icons/terms.svg"
                    alt="exit-icon"
                    width={32}
                    height={32}
                  />
                }
                title="Terms and Conditions"
                link="https://www.recoverytrek.com/terms-of-use"
                openInNewTab
              />
            </section>
          </div>
        </div>
      </DinamicMenuLayout>
    </>
  );
}

export default Settings;
