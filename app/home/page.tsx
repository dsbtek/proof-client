import { Menu, HomeHeader, HomeMain, HomeFooter } from "@/components";

const Home = () => {
  return (
    <div className="container">
      <div className="items-wrap" style={{ marginBottom: '4em' }}>
        <HomeHeader title={"HOME"} greetings={"Hello,"} />
        <HomeMain />
        <HomeFooter />
      </div>
      <div className="menu-wrapper-style">
        <Menu />
      </div>
    </div>
  );
};

export default Home;
