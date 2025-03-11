"use client";

import dynamic from 'next/dynamic';

import { Loader } from '@/components';

const Alco = dynamic(() => import('./alco-detection'), {
    loading: () => <Loader />,
    ssr: false,
})

export default Alco;