"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ReactSignatureCanvas from 'react-signature-canvas';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureCaptureProps {
    clearSignatureConfirmed: boolean;
}

const SignatureCapture = ({ clearSignatureConfirmed }: SignatureCaptureProps) => {
    const [sigCanvas, setSigCanvas] = useState<ReactSignatureCanvas | null>();
    const [signature, setSignature] = useState<string | undefined>();


    const clearSignature = useCallback(() => {
        sigCanvas?.clear();
    }, [sigCanvas]);

    const saveSignature = () => {
        setSignature(sigCanvas?.toDataURL());
    }

    useEffect(() => {
        if (clearSignatureConfirmed) {
            clearSignature();
        }
    }, [clearSignature, clearSignatureConfirmed]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <SignatureCanvas
                ref={data => setSigCanvas(data)}
                penColor='#24527B'
                canvasProps={{ width: 600, height: 250, className: 'sigCanvas' }}
            />
        </div>
    );
};

export default SignatureCapture;
