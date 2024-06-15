"use client";

import Image from "next/image";
import { useSelector } from "react-redux";

import { AgreementFooter, AgreementHeader, Button } from '@/components';
import { idFrontString, idBackString } from "@/redux/slices/appConfig";


const IDCardScanResult = () => {
    const idFront = useSelector(idFrontString);
    const idBack = useSelector(idBackString);

    return (
        <div className="container">
            <AgreementHeader title="PIP - ID Scan Result" />
            <div className="vid-items-wrap">
                <div className='captured-ids' style={{ marginTop: '40px' }}>
                    <p style={{ color: '#009cf9' }}>Front</p>
                    <Image className='captured-id' src={idFront} alt="proof captured Image" width={200} height={300} loading='lazy' />
                    <p style={{ color: '#009cf9' }}>Back</p>
                    <Image className='captured-id' src={idBack} alt="proof captured Image" width={200} height={300} loading='lazy' />
                </div>
                <div>
                    <Button classname="prompt-yes-btn m-5 move-center" link={"/identity-profile/id-detection/step-1"}>
                        Recapture
                    </Button>
                </div>
            </div>
            <AgreementFooter
                onPagination={false}
                onLeftButton={false}
                onRightButton={true}
                btnRightLink={'/identity-profile/sample-facial-capture'}
                btnRightText={"Next"}
            />
        </div>
    );
};

export default IDCardScanResult;
