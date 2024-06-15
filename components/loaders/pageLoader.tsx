"use client";
import { RotatingLines } from 'react-loader-spinner';

const Loader = () => {
    return (
        <div className='modal'>
            <RotatingLines width="50" strokeColor="#009CF9;" strokeWidth="3" />
        </div>
    )
};

export default Loader;