import { BsMegaphone } from "react-icons/bs";
import Link from "next/link";
import Button from "../button";


const HomeFooter = () => {
  return (
    <div className="new-feature">
      {/* <BsMegaphone color='#009CF9' size={30} /> */}
      <Button blue link={"/proof-pass"}>
        PROOFpass
      </Button>
    </div>
  );
};

export default HomeFooter;