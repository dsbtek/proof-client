"use client";

import { Scanner } from '@/components';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';

const MobileScan = () => {
  const params = usePathname();
  const sessionId = params.split('/').pop();
  const [baseUrl, setBaseUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.origin;
      setBaseUrl(url);
    }
  }, []);

  const handleScan = useCallback(async (data: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/scan-barcode-mobile/submit-scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          participantId: sessionId,
        }),
      });
      if (!response.ok) {
        toast.error('Failed to send data');
      }
      toast.success('Data sent successfully');
      setTimeout(() => {
        window.close();
      }, 1000);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }, [baseUrl, sessionId]);


  const handleBarcodeData = (data: string) => {
    console.log("Received barcode data:", data);
    handleScan(data)
  };

  return (
    <div className='id-detection-container'>
      <Scanner
        show={true}
        scanType="id"
        barcodeUploaded={false}
        step={2}
        totalSteps={3}
        recapture={() => false}
        closeModal={() => false}
        onBarcodeScan={handleBarcodeData}
      />
    </div>
  );
};

export default MobileScan;
