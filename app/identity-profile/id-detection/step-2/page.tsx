'use client';

import { useRouter } from 'next/navigation';
import useResponsive from '@/hooks/useResponsive';
import DesktopBarcodeDetection from './DesktopBarcodeDetection';
import MobileBarcodeDetection from './MobileBarcodeDetection';
const CameraBarcodeDetection = () => {
    const router = useRouter();
    const isDesktop = useResponsive();

    return isDesktop ? <DesktopBarcodeDetection /> : <MobileBarcodeDetection />;
};

export default CameraBarcodeDetection;
