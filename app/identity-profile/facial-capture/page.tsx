"use client";

import dynamic from 'next/dynamic';

import { Loader } from '@/components';

const DynamicCameraIDFacialDetection = dynamic(() => import('./facial-detection'), {
    loading: () => <Loader />,
    ssr: false,
})

export default DynamicCameraIDFacialDetection;