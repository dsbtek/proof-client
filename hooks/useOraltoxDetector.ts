import {
    setAlcoOraltoxAIResult,
    setOraltoxImg,
    setOraltoxResult,
} from '@/redux/slices/appConfig';
import { testData } from '@/redux/slices/drugTest';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Webcam from 'react-webcam';

interface AlcoOralResponse {
    status: string;
    message: string;
    [key: string]: any;
}

const useOraltoxDetector = (
    cameraRef: React.RefObject<Webcam | null>,
    testType: 'alco' | 'oraltox',
) => {
    const dispatch = useDispatch();
    const [alcoOralRes, setAlcoOralRes] = useState<AlcoOralResponse | null>(
        null,
    );
    const [alcoOralHasRes, setAlcoOralHasRes] = useState(false);
    const [msg, setMsg] = useState<string | undefined>();
    const [isSuccess, setIsSuccess] = useState(false);
    const [stopTimer, setStopTimer] = useState(false);
    const [counter, setCounter] = useState(0);
    const [retryCounter, setRetryCounter] = useState(0);
    const [showTimer, setShowTimer] = useState<boolean>(true);
    const [time, setTime] = useState<number>(30);
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const oralRes: any[] = [];

    const resetState = () => {
        setLoaderVisible(false);
        setTime(30);
        setShowTimer(true);
        setAlcoOralHasRes(false);
        setStopTimer(false);
        setCounter(0);
    };

    const handleBestResult = (data: Record<string, any>) => {
        if (
            !data ||
            typeof data !== 'object' ||
            Object.keys(data).length === 0
        ) {
            console.error('Invalid or empty data object');
            return;
        }

        // Get the number of items in the current data and the previous result
        const curr = Object.keys(data).length;
        const old = Object.keys(oralRes[0] || {}).length; // Ensure oralRes[0] exists

        // If new data has more items, push the new data, otherwise keep the old result
        if (curr > old) {
            oralRes[0] = data; // Replace old result with new data if it has more items
        }

        dispatch(setAlcoOraltoxAIResult(oralRes[0]));
        return oralRes[0];
    };

    const handleResponse = (response: AlcoOralResponse, screenshot: string) => {
        const { status, message } = response;
        if (status === 'success') {
            handleBestResult(response.data);
        }
        dispatch(setOraltoxResult(response.data));
        dispatch(setOraltoxImg(screenshot));
        setIsSuccess(true);
        setAlcoOralRes(response);
        setMsg(message);
        setAlcoOralHasRes(true);
    };

    const checkAlcoOraltoxAIRes = (response: { [key: string]: any }) => {
        const stripCount = Object.keys(response).length;

        if (stripCount === 10) {
            handleBestResult(oralRes[0]);
            return true;
        }

        if (stripCount < 10 && retryCounter === 3) {
            toast.info(
                'Tilt the device to reduce glare and move closer for a more accurate detection.',
            );
            setRetryCounter(0);
            return false;
        }

        setRetryCounter((prev) => prev + 1);
        return false;
    };

    const checkForAlcoOraltox = useCallback(async () => {
        if (!cameraRef.current) return false;

        const screenshot = cameraRef.current.getScreenshot();
        if (!screenshot) return false;

        const imageBase64 = screenshot.replace(/^data:image\/\w+;base64,/, '');

        if (!imageBase64) {
            toast.error('Failed to capture the image.');
            return false;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BEAM_SERVICE_URL}/read-oraltox-device`,
                { base64_image: imageBase64, type: testType },
                { headers: { 'Content-Type': 'application/json' } },
            );

            handleResponse(response.data, screenshot);
            const res = checkAlcoOraltoxAIRes(response.data);
            if (res) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking device:', error);
            toast.error('Failed to process the image.');
        }
    }, [cameraRef, testType, dispatch, counter, retryCounter]);

    useEffect(() => {
        if (stopTimer) return;
        const interval = setInterval(async () => {
            const res = checkForAlcoOraltox();
            if (await res) {
                setShowTimer(false);
                setStopTimer(true);
                clearInterval(interval);
                setLoaderVisible(true);
                return;
            }
            setTime((prev) => {
                if (prev > 1) {
                    return prev - 1;
                } else {
                    setShowTimer(false);
                    setStopTimer(true);
                    clearInterval(interval);
                    setLoaderVisible(true);
                    handleBestResult(oralRes[0]);
                    return 0;
                }
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [stopTimer, checkForAlcoOraltox]);

    return {
        msg,
        isSuccess,
        alcoOralHasRes,
        alcoOralRes,
        showTimer,
        time,
        isLoaderVisible,
        recapture: resetState,
        stopTimer,
    };
};
export default useOraltoxDetector;
