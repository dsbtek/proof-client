'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button, AppHeader, Loader, AppContainer } from '@/components';
import { useRouter } from 'next/navigation';
import { FiInfo } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import {
    bacTestData,
    connectToBreathalyzer,
    setIsConnecting,
} from '@/redux/slices/bac-test';
import { connectToBACDevice } from '@/utils/bluetooth';
import { AppDispatch } from '@/redux/store';
import { toast } from 'react-toastify';

const BacConnectDevice = () => {
    const [deviceStatus, setDeviceStatus] = useState(false);
    const router = useRouter();
    const appDispatch = useDispatch<AppDispatch>();

    const { connected, isConnecting, connectionError } =
        useSelector(bacTestData);

    const handleDeviceConnection = async () => {
        console.log('connecting...');
        setDeviceStatus(true);
        await appDispatch(connectToBreathalyzer());
    };

    useEffect(() => {
        if (connected) {
            setDeviceStatus(true);
            router.push('/bac/bac-test');
        } else {
            setDeviceStatus(false);
        }

        if (connectionError !== '') {
            toast.error(`Error Connecting Device: ${connectionError}`);
            setDeviceStatus(false);
        }
    }, [connected, connectionError, router]);

    return (
        <AppContainer
            header={<AppHeader title={'BAC TEST'} hasMute={false} />}
            body={
                <div className="bac-connect-device-container">
                    {isConnecting && <Loader />}

                    <br />
                    <br />
                    <br />
                    <Image
                        className="bac-img"
                        src="/icons/bac.svg"
                        alt="bac device image"
                        width={300}
                        height={300}
                    />
                    <br />
                    <br />
                    <br />
                    {deviceStatus === false && (
                        <p
                            className=""
                            style={{ color: '#4E555D', textAlign: 'center' }}
                        >
                            Press the &quot;Connect&quot; button and turn on the
                            BAC device.
                        </p>
                    )}
                    <br />
                    <br />
                    <br />
                    {deviceStatus && (
                        <p
                            className=""
                            style={{ color: '#4E555D', textAlign: 'center' }}
                        >
                            Turn on the BAC device
                        </p>
                    )}
                    {!deviceStatus && (
                        <Button
                            blue
                            style={{ width: '292px' }}
                            onClick={handleDeviceConnection}
                        >
                            {'Connect'}
                        </Button>
                    )}
                </div>
            }
            footer={<></>}
        />
    );
};

export default BacConnectDevice;
