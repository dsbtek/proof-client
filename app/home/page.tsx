"use client";


import { Menu, HomeHeader, HomeMain, HomeFooter, DinamicMenuLayout } from "@/components";

const Home = () => {
  return (
    <DinamicMenuLayout>
      <div className="tutorial-container">
        <HomeHeader title={"HOME"} greetings={"Hello,"} />
        <HomeMain />
        <HomeFooter />
      </div>
      {/* <div className="menu-wrapper-style">
        <Menu />
      </div> */}
    </DinamicMenuLayout>
  );
};

export default Home;
