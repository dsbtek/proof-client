"use client"

import React, { CSSProperties, useRef } from 'react';
import Button from '../button';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    style?: CSSProperties;
}

const FileUpload = ({ onFileSelect, style }: FileUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onFileSelect(event.target.files[0]);
        }
    };

    return (
        <div style={{ width: '50%' }}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                style={{ display: 'none' }}
            />
            <Button blue style={style} onClick={() => fileInputRef.current?.click()}>
                Upload File
            </Button>
        </div>
    );
};

export default FileUpload;
