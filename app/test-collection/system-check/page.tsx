'use client';

import useResponsive from '@/hooks/useResponsive';
import Mobile from './mobile';
import Desktop from './desktop';

const SystemCheck = () => {
    const isDesktop = useResponsive();
    return isDesktop ? <Desktop /> : <Mobile />;
};

export default SystemCheck;
