"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { appData } from "@/redux/slices/appConfig";
import {
  AppHeader,
  Button,
  DinamicMenuLayout,
  Header,
  Support_,
} from "@/components";
import useGetDeviceInfo from "@/hooks/useGetDeviceInfo";
import { GoArrowLeft } from "react-icons/go";

function Support() {
  const [FAQs, setFAQs] = useState([]);
  const [showFAQ, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const device = useGetDeviceInfo();

  const { FAQList, permissions } = useSelector(appData);
  const appPermissions = permissions ? permissions.split(";") : undefined;

  const toggleInfo = (index: number) => {
    return () => {
      setShowInfo(!showFAQ);
      setActiveTab(index);
    };
  };

  useEffect(() => {
    const proofFAQs =
      FAQList !== undefined
        ? FAQList.filter((faq: any) => faq.Type === "PROOF FAQ")
        : [];
    const sansFAQs =
      FAQList !== undefined
        ? FAQList.filter((faq: any) => faq.Type === "2SANS FAQ")
        : [];
    const crlFAQs =
      FAQList !== undefined
        ? FAQList.filter((faq: any) => faq.Type === "CRL FAQ")
        : [];
    const honorFAQs =
      FAQList !== undefined
        ? FAQList.filter((faq: any) => faq.Type === "Honor FAQ")
        : [];

    if (appPermissions && appPermissions.includes("PROOF FAQ")) {
      setFAQs(proofFAQs);
    } else if (appPermissions && appPermissions.includes("2SANS FAQ")) {
      setFAQs(sansFAQs);
    } else if (appPermissions && appPermissions.includes("CRL FAQ")) {
      setFAQs(crlFAQs);
    } else if (appPermissions && appPermissions.includes("Honor FAQ")) {
      setFAQs(honorFAQs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DinamicMenuLayout>
      <div className="tutorial-container support-container scroller-test">
        {device?.screenWidth < 700 && (
          <Header title="SUPPORT" icon1={<GoArrowLeft />} hasMute={false} />
        )}
        <div className="dex-only title-sub-container">
          <h4 className="set-sec-title">Customer Support</h4>
          <p className="settings-title-subtext">
            Need help? Our customer support team is here for you and browse our
            FAQs.
          </p>
        </div>
        <div className="support-content">
          <section className="support-section">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                height: "56px",
                width: "100%",
                gap: "8px",
                backgroundColor: "#FFFFFF",
                padding: "16px",
                borderRadius: "16px",
              }}
            >
              <Image
                className="dex-only"
                src="/icons/billing.svg"
                alt="billing"
                width={50}
                height={50}
                loading="lazy"
              />
              <h4>Billing</h4>
            </div>

            <Support_ tel="757-987-9800-Ext 1" title="757-987-9800-Ext 1" />
            <Support_
              email="billing@recoverytrek.com"
              title="billing@recoverytrek.com"
            />
          </section>
          <section className="support-section">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                height: "56px",
                width: "100%",
                gap: "8px",
                backgroundColor: "#FFFFFF",
                padding: "16px",
                borderRadius: "16px",
              }}
            >
              <Image
                className="dex-only"
                src="/icons/drug_test.svg"
                alt="drug test"
                width={50}
                height={50}
                loading="lazy"
              />
              <h4>Drug Testing, Collection Site</h4>
            </div>
            <Support_ tel="757-987-9800" title="757-987-9800" />
            <Support_
              email="greatsupport@recoverytrek.com"
              title="greatsupport@recoverytrek.com"
            />
          </section>
        </div>
        {FAQs.length > 0 ? (
          <div
            className=""
            style={{ marginTop: "24px", width: "100%" /*overflow: "hidden"*/ }}
          >
            <h3 className="set-text">
              FAQs{" "}
              <span className="set-label">
                (Tap question to see the answer)
              </span>
            </h3>
            <div className="faqs ">
              {FAQs.map((faq: any, index: number) => {
                return (
                  <article
                    className="faq"
                    key={index}
                    // style={
                    //   showFAQ && activeTab == index
                    //     ? { borderBottom: "1px solid #009CF9" }
                    //     : { borderBottom: "1px solid #EAEAEA" }
                    // }
                  >
                    <header className="faq-header" onClick={toggleInfo(index)}>
                      <h6 className="faq-title" onClick={toggleInfo(index)}>
                        {faq.Question}
                      </h6>
                      <Button classname="faq-btn" onClick={toggleInfo(index)}>
                        {showFAQ && activeTab == index ? (
                          <FiChevronUp
                            size={20}
                            color={activeTab == index ? "#009cf9" : "#95a3b4"}
                          />
                        ) : (
                          <FiChevronDown
                            size={20}
                            color={
                              device?.screenWidth > 700 ? "#0C1617" : "#95a3b4"
                            }
                          />
                        )}
                      </Button>
                    </header>
                    {showFAQ && activeTab == index && (
                      <div className="faq-body">
                        <p className="faq-text" key={index}>
                          {faq.Answer}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <p>You don&apos;t have Permission to view FAQs.</p>
        )}
        {/* </div> */}
        {/* <div className="menu-wrapper-style">
                <Menu />
            </div> */}
      </div>
    </DinamicMenuLayout>
  );
}

export default Support;
