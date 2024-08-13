"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HomeHeader, HomeMain, HomeFooter, DinamicMenuLayout } from "@/components";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const routeBasedOnScreenSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 700) {
        router.push('/test-collection');
      }
    };
    routeBasedOnScreenSize();
    window.addEventListener('resize', routeBasedOnScreenSize);
    return () => window.removeEventListener('resize', routeBasedOnScreenSize);
  }, [router]);

  return (
    <DinamicMenuLayout>
      <div className="tutorial-container">
        <HomeHeader title={"HOME"} greetings={"Hello,"} />
        <HomeMain />
        <HomeFooter />
      </div>
    </DinamicMenuLayout>
  );
};

export default Home;
