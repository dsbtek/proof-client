'use client';
import React from 'react';
import { Loader_ } from '@/components';
import { useSelector } from 'react-redux';
import { appData } from '@/redux/slices/appConfig';
import { transformScreensData } from '@/utils/utils';
import useResponsive from '@/hooks/useResponsive';
import DesktopView from './desktop';
import MobileView from './mobile';
import { testingKit } from '@/redux/slices/drugTest';
import { useRouter } from 'next/navigation';

interface Screen {
    // Add proper screen type definition here
    [key: string]: any;
}

const usePreTestScreens = () => {
    const [currentScreenIndex, setCurrentScreenIndex] = React.useState(0);
    const [muted, setMuted] = React.useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const router = useRouter();
    const { permissions, proof_id_value: photo } = useSelector(appData);
    const screensData = useSelector(
        (state: any) => state.preTest.preTestScreens,
    );
    const { kit_name } = useSelector(testingKit);

    const appPermissions = permissions ? permissions.split(';') : undefined;

    // Compute preTestData once when screensData changes
    const preTestData = React.useMemo(() => {
        if (
            screensData.length > 0 &&
            kit_name === '2SAN Home Drug Test Collection & Result Recording'
        ) {
            return [screensData[0]];
        }
        return screensData;
    }, [screensData, kit_name]);

    const currentScreen = preTestData[currentScreenIndex];
    const currentScreenIndex_ = transformScreensData(currentScreen);

    const handleNext = () => {
        if (kit_name === '2SAN Home Drug Test Collection & Result Recording') {
            router.push(pathLink());
        } else {
            if (currentScreenIndex < preTestData.length - 1) {
                setCurrentScreenIndex(currentScreenIndex + 1);
            }
        }
    };

    const handlePrev = () => {
        if (currentScreenIndex > 0) {
            setCurrentScreenIndex(currentScreenIndex - 1);
        }
    };

    const muteAudio = () => {
        setMuted((prev) => {
            if (audioRef.current) {
                audioRef.current.muted = !prev;
            }
            return !prev;
        });
    };

    const pathLink = (): string => {
        if (!photo && appPermissions?.includes('ID Capture with Rear Camera')) {
            return '/identity-profile/id-detection/id-capture';
        }
        return photo
            ? '/identity-profile/sample-facial-capture'
            : '/identity-profile/id-detection/step-1';
    };

    React.useEffect(() => {
        audioRef.current?.play();
        if (currentScreenIndex_ === 1) {
            setCurrentScreenIndex(1);
        }
    }, [currentScreenIndex_]);

    return {
        currentScreen,
        currentScreenIndex_,
        currentScreenIndex,
        screensData,
        handlePrev,
        handleNext,
        pathLink,
        muted,
        muteAudio,
        audioRef,
    };
};

const PreTestScreens = () => {
    const isDesktop = useResponsive();
    const screenProps = usePreTestScreens();

    if (!screenProps.currentScreenIndex_) {
        return <Loader_ />;
    }

    const View = isDesktop ? DesktopView : MobileView;

    return (
        <div className="container-test-collection">
            <View {...screenProps} />
        </div>
    );
};

export default PreTestScreens;
