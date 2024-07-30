"use client";

import dynamic from 'next/dynamic';

import { Loader } from '@/components';

const DynamicBacTest = dynamic(() => import('./bac-test'), {
    loading: () => <Loader />,
    ssr: false,
})

export default DynamicBacTest;