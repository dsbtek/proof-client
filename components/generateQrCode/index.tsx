"use client";

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Correct named import for SVG
import { usePolling } from '@/hooks/usePolling';
import { useSelector } from 'react-redux';
import { selectUserSessionId } from '@/redux/slices/appConfig';
import Link from 'next/link';
import IDCard from '../IDCard';
import { Loader_ } from '..'; // Import Loader if necessary

const MergedComponent = () => {
    const [sessionId, setSessionId] = useState<string>('');
    const [baseUrl, setBaseUrl] = useState<string>('');
    const [scannerLoad, setScannerLoad] = useState(false);
    const [data, setData] = useState<object>({});
    const [idData, setIdData] = useState<object>();
    const [loading, setLoading] = useState(true);
    const [scan, setScan] = useState(false);
    const userSessionId = useSelector(selectUserSessionId);

    // Get base URL from window.location
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = window.location.origin;
            setBaseUrl(url);
        }
    }, []);

    // Set unique session ID on mount
    useEffect(() => {
        const uniqueSessionId = Date.now().toString();
        setSessionId(uniqueSessionId);
    }, []);

    // Polling logic
    const fetchData = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`/api/scan-barcode-mobile/check-scan?participantId=${sessionId}`);
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error fetching data:', errorMessage);
                setData({});
                return;
            }

            const result = await response.json();
            console.log(JSON.parse(result.value));
            setData(JSON.parse(result?.value));
            setScan(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Use polling hook, polling every 5 seconds (5000ms)
    usePolling(fetchData, 5000);

    // Update ID data when scan is successful
    useEffect(() => {
        if (scan) {
            setIdData(data);
        }
    }, [data, scan]);

    const url = `${baseUrl}/identity-profile/id-detection/mobile-scan-step-2/${sessionId}`;

    return (
        <div style={{ height: '100vh', width: '100vw', zIndex: '10000', position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey' }}>
            {sessionId && !scan &&
                <div
                    className="wrap-qr"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '60%',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                    }}
                >

                <h2>Scan with your mobile device</h2>
                <br />
                <br />
                    <QRCodeSVG value={url} size={256} />
            </div>
            }
            {scan &&
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50px', width: '100%' }}>
                    <IDCard idDetails={idData} />
                </div>
            }
        </div>
    );
};

export default MergedComponent;
