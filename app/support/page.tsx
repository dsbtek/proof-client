"use client";

import { useSelector } from 'react-redux';
import { use, useEffect, useState } from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

import { appData } from '@/redux/slices/appConfig';
import { AppHeader, Button, Menu, Setting } from '@/components';

function Support() {
    const [FAQs, setFAQs] = useState([]);
    const [showFAQ, setShowInfo] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const { FAQList, permissions } = useSelector(appData);
    const appPermissions = permissions ? permissions.split(";") : undefined;

    const toggleInfo = (index: number) => {
        return () => {
            setShowInfo(!showFAQ);
            setActiveTab(index);
        }
    };

    useEffect(() => {
        const proofFAQs = FAQList !== undefined ? FAQList.filter((faq: any) => faq.Type === 'PROOF FAQ') : [];
        const sansFAQs = FAQList !== undefined ? FAQList.filter((faq: any) => faq.Type === '2SANS FAQ') : [];
        const crlFAQs = FAQList !== undefined ? FAQList.filter((faq: any) => faq.Type === 'CRL FAQ') : [];
        const honorFAQs = FAQList !== undefined ? FAQList.filter((faq: any) => faq.Type === 'Honor FAQ') : [];

        if (appPermissions && appPermissions.includes('PROOF FAQ')) {
            setFAQs(proofFAQs);
        } else if (appPermissions && appPermissions.includes('2SANS FAQ')) {
            setFAQs(sansFAQs);
        } else if (appPermissions && appPermissions.includes('CRL FAQ')) {
            setFAQs(crlFAQs);
        } else if (appPermissions && appPermissions.includes('Honor FAQ')) {
            setFAQs(honorFAQs);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container">
            <div className="items-wrap">
                <AppHeader title="SUPPORT" />
                <div className="support-content">
                    <section className="settings-section">
                        <h6 className="set-label">Billing:</h6>
                        <Setting tel='757-987-9800-Ext 1' title='757-987-9800-Ext 1' />
                        <Setting email='billing@recoverytrek.com' title='billing@recoverytrek.com' />
                    </section>
                    <section className="settings-section">
                        <h6 className="set-label">Drug Testing, Collection Site, Etc:</h6>
                        <Setting tel='757-987-9800' title='757-987-9800' />
                        <Setting email='greatsupport@recoverytrek.com' title='greatsupport@recoverytrek.com' />
                    </section>
                </div>
                {FAQs.length > 0 ? <div className='faqs scroller'>
                    <h3 className='set-text'>FAQs <span className="set-label">(Tap question to see the answer)</span></h3>
                    {FAQs.map((faq: any, index: number) => {
                        return (
                            <article className='faq' key={index} style={showFAQ && activeTab == index ? { borderBottom: '1px solid #009CF9' } : { borderBottom: '1px solid #EAEAEA' }}>
                                <header className='faq-header' onClick={toggleInfo(index)}>
                                    <h6 className='faq-title' onClick={toggleInfo(index)}>{faq.Question}</h6>
                                    <Button classname='faq-btn' onClick={toggleInfo(index)}>
                                        {showFAQ && activeTab == index ? <AiOutlineUp size={20} color={activeTab == index ? '#009cf9' : '#95a3b4'} /> : <AiOutlineDown size={20} color='#95a3b4' />}
                                    </Button>
                                </header>
                                {showFAQ && activeTab == index && <div className='faq-body'>
                                    <p className='faq-text' key={index}>{faq.Answer}</p>
                                </div>}
                            </article>
                        )
                    })}
                </div> : <p>You don&apos;t have Permission to view FAQs.</p>}
            </div>
            <div className="menu-wrapper-style">
                <Menu />
            </div>
        </div>
    )
};

export default Support;