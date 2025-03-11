'use client';
import { AppContainer, AppHeader, Scannner_80 } from '@/components';
import useResponsive from '@/hooks/useResponsive';
import { testingKit } from '@/redux/slices/drugTest';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

function ScanPakageBarcode() {
    const [showBCModal, setShowBCModal] = useState<boolean>(true);
    const [barcodeUploaded, setBarcodeUploaded] = useState<boolean>(true);
    const { kit_id } = useSelector(testingKit);
    const router = useRouter();
    const preTestQuestionnaire = useSelector(
        (state: any) => state.preTest.preTestQuestionnaire,
    );
    const isDesktop = useResponsive();
    const [scanCount, setScanCount] = useState(0);

    const closeBCModal = () => {
        setShowBCModal(false);
        setBarcodeUploaded(false);
        if (preTestQuestionnaire && preTestQuestionnaire?.length > 0) {
            router.push('/pre-test-questions');
        } else {
            router.push(`/test-collection/${kit_id}`);
        }
    };

    return (
        <AppContainer
            header={<AppHeader title="Kit Barcode scan" hasMute={false} />}
            body={
                <div
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: isDesktop ? 'row' : 'column',
                        width: '100%',
                        height: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <div
                        className="camera-wrap-desktop"
                        style={{
                            width: '100%',
                            alignItems: isDesktop ? 'flex-start' : 'center',
                        }}
                    >
                        <div className="sub-item-2">
                            {isDesktop && (
                                <h3 className="">Kit Barcode scan</h3>
                            )}
                            <br />

                            <p className="m-5">
                                Please scan the barcode on the &quot;extra label
                                &quot; located on the end of the box your kit
                                supplies were in. Barcode begins with
                                &quot;80&quot;.
                                <br />
                            </p>
                            <br />
                            {/* <Image className='id-image-2' src='/images/proof-identity-profile.svg' alt="captured Image" width={5000} height={5000} loading='lazy' /> */}
                            <br />
                            <p className="vid-text m-5">
                                Please ensure the barcode is within the guide
                                frame.
                            </p>
                        </div>
                        {!isDesktop && (
                            <Scannner_80
                                show={showBCModal}
                                scanType="detect"
                                barcodeUploaded={true}
                                // step={2}
                                // totalSteps={3}
                                recapture={false}
                                closeModal={closeBCModal}
                                packageScanType80={true}
                                scanCount={scanCount}
                                setScanCount={setScanCount}
                            />
                        )}
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            right: '0',
                            top: '0',
                            width: '50%',
                            height: '100%',
                            zIndex: '1000',
                        }}
                    >
                        {isDesktop && (
                            <Scannner_80
                                show={showBCModal}
                                scanType="detect"
                                barcodeUploaded={true}
                                step={2}
                                totalSteps={3}
                                recapture={false}
                                closeModal={closeBCModal}
                                packageScanType80={true}
                                scanCount={scanCount}
                                setScanCount={setScanCount}
                            />
                        )}
                    </div>
                </div>
            }
            footer={''}
        />
    );
}

export default ScanPakageBarcode;
