'use client'
import { Menu, AppHeader, Button } from "@/components";
import { appData } from '@/redux/slices/appConfig';
import { useState } from "react";
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { useSelector } from "react-redux";

const WhatNew = () => {
  const whatNewData = useSelector(appData);
  const [data, setData] = useState(whatNewData.WhatNewList)
  const [showFAQ, setShowInfo] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const toggleInfo = (index: number) => {
    return () => {
      setShowInfo(!showFAQ);
      setActiveTab(index);
    }
  };


  const extractLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links = text.match(urlRegex);
    return links || [];
  }

  return (
    <div className="container">
      <AppHeader title={"What`s New"} />
      <br /> <br />
      {/* <div className="bd-what-new-detail">
        <div className="lds-ripple"><div></div><div></div></div>
      </div> */}
      <div className='scroller what-new-bg'>
        {data?.map((item: any, index: number) => {
          return (
            <article className='faq ' key={index} style={showFAQ && activeTab == index ? { borderBottom: '1px solid #009CF9' } : { borderBottom: '1px solid #EAEAEA' }}>
              <header className='faq-header' onClick={toggleInfo(index)}>
                <h6 className='faq-title' onClick={toggleInfo(index)}>{item.Title}</h6>
                <Button classname='faq-btn' onClick={toggleInfo(index)}>
                  {showFAQ && activeTab == index ? <AiOutlineUp size={20} /> : <AiOutlineDown size={20} />}
                </Button>
              </header>
              {showFAQ && activeTab == index &&
                <>
                  <div className='faq-body'><p className='faq-text' key={index}>{item.Detail}</p></div>
                  <div className='faq-body'><p className='faq-text what-new-link' key={index}>{extractLinks(item.Detail)}</p></div>
                </>
              }
            </article>
          )
        })}
      </div>
      <div className="menu-wrapper-style">
        <Menu />
      </div>
    </div>
  );
};

export default WhatNew;
