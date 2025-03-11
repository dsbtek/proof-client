'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import {
    AgreementHeader,
    AppContainer,
    AppHeader,
    DesktopFooter,
    PipStepLoader,
} from '@/components';
import { appData, userIdString } from '@/redux/slices/appConfig';
import { useRouter } from 'next/navigation';
import { testingKit } from '@/redux/slices/drugTest';

const Desktop = () => {
    const { permissions, proof_id_value } = useSelector(appData);
    const userID = proof_id_value;
    const appPermissions = permissions ? permissions.split(';') : undefined;
    const [identityPermission, setIdentityPermission] = useState('');
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const router = useRouter();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [muted, setMuted] = useState(false);
    const { kit_id, Scan_Kit_Label, kit_name } = useSelector(testingKit);
    const preTestQuestionnaire = useSelector(
        (state: any) => state.preTest.preTestQuestionnaire,
    );
    useEffect(() => {
        if (userID) {
            setLoaderVisible(true);
        }
        if (appPermissions && appPermissions.includes('PROOF_ID')) {
            setIdentityPermission('PROOF_ID');
        }
        if (appPermissions && appPermissions.includes('NO_ID')) {
            setIdentityPermission('NO_ID');
        }
    }, [appPermissions, userID]);

    const pathLink = (): string => {
        if (
            !userID &&
            appPermissions &&
            appPermissions.includes('ID Capture with Rear Camera')
        )
            return '/identity-profile/id-detection/id-capture';
        else if (
            userID &&
            appPermissions.includes('ID Capture with Rear Camera')
        )
            return preTestQuestionnaire?.length > 0
                ? '/pre-test-questions'
                : '/test-collection/clear-view';
        else
            return userID
                ? '/identity-profile/sample-facial-capture'
                : '/identity-profile/id-detection/step-1';
    };

    const handleLoaderClose = () => {
        setLoaderVisible(false);
        router.push(pathLink());
    };

    const toggleMute = () => {
        setMuted(!muted);
        if (audioRef.current) {
            audioRef.current.muted = !muted;
        }
    };

    return (
        <>
            <PipStepLoader
                pipStep={2}
                isVisible={isLoaderVisible}
                onClose={handleLoaderClose}
            />
            <AppContainer
                header={
                    <AppHeader
                        title={'Camera View'}
                        hasMute={true}
                        onClickMute={toggleMute}
                        muted={muted}
                    />
                }
                body={
                    <div className="test-items-wrap-desktop_">
                        <div className="sub-item">
                            <div style={{ minHeight: '10px' }}>
                                <p className="get-started-title bold-headigs">
                                    Camera View
                                </p>
                                <p className="camera-view-text with-bullet">
                                    Proper Camera positioning, and attention
                                    during the test will be important for your
                                    collection. Please stay in the frame and
                                    ensure that you and your workspace are in
                                    clear view. Do not move your location or
                                    leave camera frame during your collection.
                                </p>
                                <br />
                                <br />
                                <p className="with-bullet">
                                    Press{' '}
                                    <span className="bold-headigs">Next</span>{' '}
                                    to continue.
                                </p>
                            </div>
                        </div>
                        <div
                            className="wrap-img"
                            style={{
                                backgroundImage:
                                    "url('/images/camera-view.svg')",
                            }}
                        />
                        <audio
                            ref={audioRef}
                            src="/audio/camera_view.mp3"
                            controls={false}
                            muted={muted}
                            autoPlay
                        />
                    </div>
                }
                footer={
                    <DesktopFooter
                        currentNumber={5}
                        outOf={5}
                        onPagination={true}
                        onLeftButton={false}
                        onRightButton={true}
                        btnLeftLink={''}
                        btnRightLink={pathLink()}
                        btnLeftText={'Decline'}
                        btnRightText={'Next'}
                    />
                }
            />
        </>
    );
};

export default Desktop;
