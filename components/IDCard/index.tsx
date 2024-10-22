import React from 'react';
import './IDCard.css'; // Import the CSS file for styling
import { setIdDetails } from '@/redux/slices/drugTest';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

const IDCard = ({ idDetails }: { idDetails: any }) => {
    const dispatch = useDispatch();

    if (!idDetails) {
        return <p>No ID details available.</p>; // Fallback if idDetails is undefined
    } else {
        dispatch(setIdDetails(idDetails));
    }

    console.log(idDetails);
    return (
        <div className="id-card">
            <h2 className="id-card-title">Driver`s License Information</h2>
            <div className="id-card-details">
                <p><strong>Last Name:</strong> {idDetails?.last_name || 'N/A'}</p>
                <p><strong>First Name:</strong> {idDetails?.first_name || 'N/A'}</p>
                <p><strong>Date of Birth:</strong> {idDetails?.date_of_birth || 'N/A'}</p>
                <p><strong>Gender:</strong> {idDetails?.gender === '1' ? 'Male' : 'Female'}</p>
                <p><strong>Eye Color:</strong> {idDetails?.eyeColor || 'N/A'}</p>
                <p><strong>Height:</strong> {idDetails?.height || 'N/A'}</p>
                <p><strong>Address:</strong> {idDetails?.address || 'N/A'}</p>
                <p><strong>City:</strong> {idDetails?.city || 'N/A'}</p>
                <p><strong>State:</strong> {idDetails?.state || 'N/A'}</p>
                <p><strong>Zip Code:</strong> {idDetails?.zipcode || 'N/A'}</p>
            </div>
            <br />
            <br />
            <Link className='link-con' href={'/identity-profile/sample-facial-capture'}>Continue</Link>
        </div>
    );
};

export default IDCard;
