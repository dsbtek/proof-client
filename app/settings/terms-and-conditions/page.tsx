"use client";

import { useState } from 'react';

import { AppHeader, Loader_ } from '@/components';

function TermsAndConditions() {
    const [loading, setLoading] = useState(true);

    const handleLoad = () => {
        setLoading(false);
    };

    return (
        <div className="container">
            <AppHeader title="Terms & Conditions" />

            {loading && (
                <Loader_ />
            )}

            <div style={{ width: '100%', height: '100vh', marginTop: '12px' }}>
                <iframe
                    src="https://www.recoverytrek.com/terms-of-use"
                    style={{ width: '100%', height: '100%', border: 'none', display: loading ? 'none' : 'block' }}
                    title="Terms and Conditions"
                    onLoad={handleLoad}
                />
            </div>

        </div>
    );
}

export default TermsAndConditions;
