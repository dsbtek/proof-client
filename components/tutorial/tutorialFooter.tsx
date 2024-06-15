import Link from "next/link";

import { Button } from "@/components";

const TutorialFooter = () => {
  return (
    <div className="footer-wrap">
      {/* <div className="new-feature">
        <div className="phone-icon">
          <Image src="/images/proof.png" alt="image" width={25} height={50} loading='lazy' />
        </div>
        <div className="detail">
          <h1>New App Features Tutorial</h1>
          <p>Check the new features we added!</p>
        </div>
      </div> */}
      <div className="review-later">
        <div className={"checkbox-wrapper"}>
          <input type="checkbox" checked={false} onChange={() => { }} />
          <label className="label-chk">
            {"Don’t show welcome screen again."}
          </label>
        </div>
        <Link href={"/home"} className="link">
          <Button classname="btn-review">Review Later</Button>
        </Link>
      </div>
    </div>
  );
};

export default TutorialFooter;
