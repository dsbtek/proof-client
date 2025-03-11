"use client";

import dynamic from 'next/dynamic';

import { Loader } from '@/components';

const OralTox = dynamic(() => import('./oraltox-detection'), {
    loading: () => <Loader />,
    ssr: false,
})

export default OralTox;