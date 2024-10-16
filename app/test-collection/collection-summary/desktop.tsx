"use client";

import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { AgreementFooter, AppHeader, AppHeaderDesktop, Button, DesktopFooter, MiniLoader } from '@/components';
import { testData } from '@/redux/slices/drugTest';
import { appData } from '@/redux/slices/appConfig';
import { GoMute } from 'react-icons/go';
import { RxSpeakerLoud } from 'react-icons/rx';


function Desktop() {
    const router = useRouter();
    const pathname = usePathname();
    const { startTime, endTime, testClip, uploading, confirmationNo } = useSelector(testData);
    const { Shipping_Carrier } = useSelector(appData);

    const exitAndSave = () => {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = testClip;
        a.download = "proof-capture1.mp4";
        a.click();

        router.push('/home');
    };

    useEffect(() => {
        function beforeUnloadHandler(event: BeforeUnloadEvent) {
            event.preventDefault();
            toast('Please wait for the video to finish uploading', { autoClose: 5000 });
        }

        if (uploading === true && pathname === '/test-collection/collection-summary') {
            window.addEventListener('beforeunload', beforeUnloadHandler);
        }

        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, [uploading, pathname]);

    return (
        <div className='summary-container'>
            <div className='test-head'>
                {/* <AppHeader title='' /> */}
                <AppHeaderDesktop title="" />
                <div className='test-audio'>
                    {<GoMute color='#adadad' style={{ cursor: 'pointer' }} />}
                    {/* <AiFillCloseCircle color='red' onClick={handleDialog} style={{ cursor: 'pointer' }} /> */}
                </div>
            </div>
            <div className="wrap-dx">
                <div className="items-wrap-collection-summary">
                    <div className="summary-content">
                        <h2>Collection Summary</h2>
                        <p className="sum-warning">
                            Attention: Do not close the PROOF App! Please confirm that the transmission status
                            below is shown as <span style={{ color: 'red' }}>UPLOAD COMPLETE</span> before exiting the application.
                        </p>
                        <article className="sum-texts">
                            <div className="sum-text">
                                <h4>Confirmation:</h4>
                                {confirmationNo === '' ? <MiniLoader /> : <p>{confirmationNo}</p>}
                            </div>
                            <div className="sum-text">
                                <h4>Collection Start:</h4>
                                <p>{startTime}</p>
                            </div>
                            <div className="sum-text">
                                <h4>Collection End:</h4>
                                <p>{endTime}</p>
                            </div>
                        </article>
                        <div className={uploading === undefined ? "test-upload-fail" : uploading ? "upload-status" : "test-upload-pass"}>
                            {uploading === undefined ? "Upload Failed!" : uploading ? "Test Uploading. Please Wait..." : "Upload Complete!"} {uploading && <MiniLoader />}
                        </div>
                        {/* <div className="exit-btns"> */}
                        <Button classname="exit-btn" onClick={exitAndSave} disabled={uploading}>EXIT and SAVE video to my smart phone {uploading ? <MiniLoader /> : ''}</Button>
                        <Button classname="exit-btn-trans" onClick={() => router.push('/home')} disabled={uploading}>EXIT and DO NOT SAVE  video to my smartphone {uploading ? <MiniLoader /> : ''}</Button>
                        <a style={{ display: 'flex', width: '80%', justifyContent: 'center' }} href={Shipping_Carrier !== null ? Shipping_Carrier : 'https://www.fedex.com/en-us/home.html'} target='_blank' referrerPolicy='no-referrer'><Button style={{ width: '100%' }} classname="exit-btn-trans" >EXIT and locate shipping carrier location options</Button></a>
                    </div>
                </div>

                {/* </div> */}
                <div className="video-preview">
                    <video autoPlay loop muted src={testClip} className="vid-prev"></video>
                </div>
                <div className='collection-summary-submission-status'> {uploading ? "Uploading Process..." : "Uploaded Successfully"}</div>
            </div>

            <DesktopFooter
                currentNumber={0}
                outOf={0}
                onPagination={false}
                onLeftButton={false}
                onRightButton={false}
                btnLeftLink={"/"}
                btnRightLink={""}
                btnLeftText={"Back"}
                btnRightText={"Next"}
            />
        </div>
    )
};

export default Desktop; 