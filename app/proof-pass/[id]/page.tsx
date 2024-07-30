/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from 'next/navigation';
import { AppHeader, Button, ImageModal, MiniLoader, ThumbnailGallery } from '@/components';
import { historyData } from "@/redux/slices/appConfig";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useEffect, useState } from "react";
import Crypto from "crypto-js";

const ProofPassDetail = () => {
    const history = useSelector(historyData);
    const params = usePathname();
    const id = params.split('/').pop();
    const proofpass = history?.dtests?.find((item: any, index: number) => index === parseInt(id as string));
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [imageNames, setImageNames] = useState<string[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLoadingImages, setIsLoadingImages] = useState(false);


    useEffect(() => {
        const participant_id = localStorage.getItem('participant_id');
        const pin = localStorage.getItem('pin');

        // Decrypt Function
        const decryptData = (encryptedData: any, secretKey: string | undefined) => {
            const bytes = Crypto.AES.decrypt(encryptedData, secretKey);
            const decryptedData = bytes.toString(Crypto.enc.Utf8);
            return decryptedData;
        };

        if (participant_id && pin && proofpass?.Images) {
            const decryptedId = decryptData(participant_id, process.env.NEXT_PUBLIC_SECRET_KEY);
            const decryptedPin = decryptData(pin, process.env.NEXT_PUBLIC_SECRET_KEY);

            const fetchImage = async (imageId: string | unknown) => {
                try {
                    const response = await fetch("/api/fetch-image", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ photo_id: imageId, participant_id: decryptedId, pin: decryptedPin }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    // imageData.push(data?.data?.Imagebase64)
                    return data?.data?.Imagebase64;
                } catch (error) {
                    console.error('Error fetching image:', error);
                    return null;
                }
            };



            const handleSubmit = async () => {
                const images = proofpass.Images;
                const imagePromises = Object.values(images).map((imageId) => fetchImage(imageId));
                const imgNames = Object.keys(images);
                const imageResponses = await Promise.all(imagePromises);
                setImageUrls(imageResponses.filter(Boolean));
                setImageNames(imgNames)
                setIsLoadingImages(true)
            };

            handleSubmit();
        }
    }, [proofpass]);

    const getNumberOfDays = (startDate: string | undefined) => {
        if (!startDate) return NaN;
        const startDateObject = new Date(startDate);
        const currentDate = new Date();
        const difference = currentDate.getTime() - startDateObject.getTime();
        const daysDifference = difference / (1000 * 60 * 60 * 24);
        return Math.floor(daysDifference);
    };

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <div className="container">
            <div className="proof-pass-header">
                <AppHeader title="" />
                <Image src='/icons/pr-logo.svg' alt="proof logo" width={70} height={70} loading='lazy' />
            </div>
            <div className={`proofpass-detail ${proofpass?.DrugTestResultStatus ? proofpass?.DrugTestResultStatus : "Inconclusive"} proofpass-text`}>
                <div className="proof-pass-head">
                    <h1>{proofpass?.DrugTestResultStatus?.toLocaleUpperCase()}</h1>
                    <p>{proofpass?.TestPanel}</p>
                    <p>{`This service took place ${getNumberOfDays(proofpass?.servicedate)} days ago`}</p>
                </div>
                <div className="wrap-result-item" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <p>Donor Participant ID:</p> <p>{proofpass?.ParticipantID}</p>
                </div>
                {proofpass?.DrugTestResultStatus === 'Negative' ? (
                    <div className="proof-pass-item-border border-green"></div>
                ) : (
                    <div className="proof-pass-item-border border-light"></div>
                )}
                <div className="wrap-result-item" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <p>Date of Service: </p> <p>{proofpass?.servicedate}</p>
                </div>
                {proofpass?.DrugTestResultStatus === 'Negative' ? (
                    <div className="proof-pass-item-border border-green"></div>
                ) : (
                    <div className="proof-pass-item-border border-light"></div>
                )}
                <div className="wrap-result-item" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <p>Identity:</p> <p>{proofpass?.GovernmentPhotoID || "Not Applicable"}</p>
                </div>
                {proofpass?.DrugTestResultStatus === 'Negative' ? (
                    <div className="proof-pass-item-border border-green"></div>
                ) : (
                    <div className="proof-pass-item-border border-light"></div>
                )}
                <div className="wrap-result-item" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <p>Collection:</p> <p>{proofpass?.CollectionDesignation || "Not Applicable"}</p>
                </div>
                {proofpass?.Images && (
                    <div>
                        <Button blue onClick={openModal} disabled={!isLoadingImages}>{isLoadingImages ? "DOCUMENT IMAGES" : <div className='loading-images'><h4>Loading</h4> <MiniLoader /></div>}</Button>
                    </div>
                )}
            </div>
            <ImageModal isOpen={modalIsOpen} onClose={closeModal} imageUrls={imageUrls} imageNames={imageNames} />
            <h4>PROOFpass</h4>
            <br />
            <p>proof@recoverytrek.com</p>
        </div>
    );
};

export default ProofPassDetail;
