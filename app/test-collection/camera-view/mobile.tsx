'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import {
    AgreementHeader,
    AgreementFooter,
    PipStepLoader,
    AppContainer,
    AppHeader,
} from '@/components';
import { appData, userIdString } from '@/redux/slices/appConfig';
import { useRouter } from 'next/navigation';
import { testingKit } from '@/redux/slices/drugTest';

const Mobile = () => {
    const { permissions, proof_id_value } = useSelector(appData);
    const userID = proof_id_value;
    const appPermissions = permissions ? permissions.split(';') : undefined;
    const [identityPermission, setIdentityPermission] = useState('');
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const router = useRouter();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [muted, setMuted] = useState(false);
    const { kit_id, Scan_Kit_Label, kit_name } = useSelector(testingKit);
    // ID Capture with Rear Camera
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

    const handleLoaderClose = () => {
        setLoaderVisible(false);
        userID && !appPermissions.includes('ID Capture with Rear Camera')
            ? router.push('/identity-profile/sample-facial-capture')
            : userID && appPermissions.includes('ID Capture with Rear Camera')
            ? router.push('/identity-profile/id-detection/id-capture')
            : router.push('/identity-profile');
    };

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
                        title=" Camera View"
                        hasMute={true}
                        onClickMute={toggleMute}
                        muted={muted}
                    />
                }
                body={
                    <div className="agreement-items-wrap">
                        <Image
                            className="get-started-img"
                            src="/images/camera-view-mobile.svg"
                            alt="image"
                            width={3000}
                            height={3000}
                        />
                        <p className="get-started-title">Camera View</p>
                        <p className="camera-view-text">
                            Proper Camera positioning, and attention during the
                            test will be important for your collection. Please
                            stay in the frame and ensure that you and your
                            workspace are in clear view. Do not move your
                            location or leave camera frame during your
                            collection.
                            <br />
                            Press Next to continue.
                        </p>
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
                    <AgreementFooter
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

export default Mobile;
