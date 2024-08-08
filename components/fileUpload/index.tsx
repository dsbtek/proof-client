"use client"

import React, { CSSProperties, useRef } from 'react';
import Image from 'next/image';
import Button from '../button';

interface FileUploadProps {
    style?: CSSProperties;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onUpload: (files: FileList) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ style, onChange, onClose, onUpload }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onUpload(event.target.files);
        }
        onChange(event);
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div style={{ width: '50%', display: 'flex' }}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <Button white style={style} onClick={handleClick}>
                <Image
                    className="upload-icon"
                    src="/icons/upload-icon.svg"
                    alt="Upload Icon"
                    width={20}
                    height={20}
                />
                Upload File
            </Button>
            <Button white style={{ marginLeft: '10px' }} onClick={onClose}>
                Cancel
            </Button>
        </div>
    );
};

export default FileUpload;
