"use client";

import { useState } from "react";
import Link from 'next/link';
import { Switch, HomeGridView, HomeListView } from "@/components";
import Cookies from "js-cookie";
import { BsMegaphone } from "react-icons/bs";


import { setCookie } from "@/utils/utils";

const HomeMain = () => {
  const homeViewCookie = Cookies.get("homeView");
  const [checked, setChecked] = useState(homeViewCookie === 'true' ? true : false);

  const handleSwitch = () => {
    if (homeViewCookie === 'false') {
      setCookie('homeView', 'true', 2000);
      setChecked(true)
    } else {
      setCookie('homeView', 'false', 2000);
      setChecked(false)
    }
  };

  return (
    <div className="home-main-body">
      <div className="home-switch-wrap">
        <Switch onToggle={handleSwitch} checked={checked} showLabel />
      </div>
      {checked ? (
        <div className="home-sub-wrap-grid">
          <Link href="/test-collection" className="home-link">
            <HomeGridView
              imgUrl="/images/drug-test.png"
              title={"Test/Collection"}
            />
          </Link>
          <Link href="/history" className="home-link">
            <HomeGridView
              imgUrl="/images/bac-test.png"
              title={"Bac Test"}
            />
          </Link>
          <Link href="/pending-test" className="home-link">
            <HomeGridView
              imgUrl="/images/pending-test.png"
              title={"Pending Test"}
            />
          </Link>
          <Link href="/history" className="home-link">
            <HomeGridView
              imgUrl="/images/history.png"
              title={"History"}
            />
          </Link>
          <Link href="/what-new" className="home-link">
            <HomeGridView
              // <BsMegaphone color='#009CF9' size={30} />
              imgUrl="/images/what-new.png"
              title={"What`s New"}
            />
          </Link>

        </div>
      ) : (
        <div className="list-wrap">
          <Link href="/test-collection" className="home-link">
            <HomeListView imgUrl="/images/drug-test.png" title={"Test/Collection"} />
          </Link>
          <Link href="/history" className="home-link">
            <HomeListView imgUrl="/images/bac-test.png" title={"Bac Test"} />
          </Link>
          <Link href="/pending-test" className="home-link">
            <HomeListView imgUrl="/images/pending-test.png" title={"Pending Test"} />
          </Link>
          <Link href="/history" className="home-link">
            <HomeListView imgUrl="/images/history.png" title={"History"} />
          </Link>
          <Link href="/what-new" className="home-link">
            <HomeListView imgUrl="/images/what-new.png" title={"What`s New"} />
          </Link>
        </div>
      )}
    </div>
  );
};
export default HomeMain;
