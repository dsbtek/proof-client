"use client";

import { useState } from "react";
import Link from 'next/link';
import { Switch, HomeGridView, HomeListView } from "@/components";
import Cookies from "js-cookie";
import { appData, setReDirectToBac } from "@/redux/slices/appConfig";
import { hasPermission, setCookie } from "@/utils/utils";
import { useDispatch, useSelector } from "react-redux";

const HomeMain = () => {
    const userPermissions = useSelector(appData);
    const permissions = userPermissions?.permissions
    const pendingTest = localStorage.getItem("pendingTest");
    const homeViewCookie = Cookies.get("homeView");
    const [checked, setChecked] = useState(homeViewCookie === 'true' ? true : false);
    const dispatch = useDispatch();
    const user = useSelector(appData);
    const photo = user?.photo

    const handleSwitch = () => {
        if (homeViewCookie === 'false') {
            setCookie('homeView', 'true', 2000);
            setChecked(true)
        } else {
            setCookie('homeView', 'false', 2000);
            setChecked(false)
        }
    };

    const updateRedirection = async () => {
        dispatch(setReDirectToBac(true));
    };

    return (
        <div className="home-main-body">
            <div className="home-switch-wrap">
                <Switch onToggle={handleSwitch} checked={checked} showLabel />
            </div>
            {checked ? (
                <div className="home-sub-wrap-grid">

                    {hasPermission('Test', permissions) &&
                        <Link href="/test-collection" className="">
                            <HomeGridView
                                imgUrl="/icons/test.svg"
                                title={"Test/Collection"}
                            />
                        </Link>
                    }

                    {hasPermission('Test', permissions) &&
                        <Link href={photo ? "/identity-profile/sample-facial-capture" : "/identity-profile/id-detection/step-1"} className="" onClick={updateRedirection}>
                            <HomeGridView
                                imgUrl="/icons/bac-icon.svg"
                                title={"Bac Test"}
                            />
                        </Link>
                    }

                    {pendingTest &&
                        <Link href="/pending-test" className="">
                            <HomeGridView
                                imgUrl="/icons/pending-test.svg"
                                title={"Pending Test"}
                            />
                        </Link>
                    }

                    <Link href="/history" className="">
                        <HomeGridView
                            imgUrl="/icons/history.svg"
                            title={"History"}
                        />
                    </Link>
                    {hasPermission('PROOF Whats New', permissions) &&
                        <Link href="/what-new" className="">
                            <HomeGridView
                                imgUrl="/icons/whats-new.svg"
                                title={"What`s New"}
                            />
                        </Link>
                    }

                </div>
            ) : (
                <div className="list-wrap">
                    {hasPermission('Test', permissions) &&
                        <Link href="/test-collection" className="home-link">
                            <HomeListView imgUrl="/icons/test.svg" title={"Test/Collection"} />
                        </Link>
                    }
                    {hasPermission('Test', permissions) &&
                        <Link href={photo ? "/identity-profile/sample-facial-capture" : "/identity-profile/id-detection/step-1"} className="home-link" onClick={updateRedirection}>
                            <HomeListView imgUrl="/icons/bac-icon.svg" title={"Bac Test"} />
                        </Link>
                    }
                    {pendingTest &&
                        <Link href="/pending-test" className="home-link">
                            <HomeListView imgUrl="/icons/pending-test.svg" title={"Pending Test"} />
                        </Link>
                    }
                    <Link href="/history" className="home-link">
                        <HomeListView imgUrl="/icons/history.svg" title={"History"} />
                    </Link>
                    {hasPermission('PROOF Whats New', permissions) &&
                        <Link href="/what-new" className="home-link">
                            <HomeListView imgUrl="/icons/whats-new.svg" title={"What`s New"} />
                        </Link>
                    }
                </div>
            )}
        </div>
    );
};
export default HomeMain;

