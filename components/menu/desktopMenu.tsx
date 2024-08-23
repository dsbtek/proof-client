'use client'

import Image from 'next/image';
import { GoHome } from "react-icons/go";
import { BsMortarboardFill } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { appData, appDataDump } from "@/redux/slices/appConfig";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import "./menu.css";
import Button from '../button';
import { clearTestData } from '@/redux/slices/drugTest';
import { logout } from '@/redux/slices/auth';


const DextopMenu = () => {
    const { first_name, last_name } = useSelector(appData);
    const pathname = usePathname();
    const user = useSelector(appData);
    const photo = user?.photo
    const dispatch = useDispatch();
    const router = useRouter();


    return (
        <nav className="menu">

            <Link href="#" className="sub-menu" style={{display: "block", textAlign: "left", borderBottom: "none", height: "80px"}} >

                <p className="greet-text">{"Hello,"}</p>
                <p className="user-name" style={{fontSize="irem"}}>
                    {first_name + ' ' + last_name}
                </p>

            </Link>
            <br />
            <Link href="/test-collection" className="sub-menu" style={pathname === '/test-collection' ? { backgroundColor: '#E5F5FF' } : {}}>
                {/* <GoHome size={30} color={pathname === '/home' ? '#009CF9' : '#ADADAD'} /> */}
                {pathname === '/test-collection' ?
                    <Image className="" src='/icons/test.svg' alt="captured Image" width={5000} height={5000} loading="lazy" />
                    :
                    <Image className="" src='/icons/un-select-test-collection.svg' alt="captured Image" width={5000} height={5000} loading="lazy" />
                }
                <p className="menu-text" style={pathname === '/test-collection' ? { color: '#009CF9' } : {}}>Test/Collection</p>
            </Link>

            <Link href="/pending-test" className="sub-menu" style={pathname === '/pending-test' ? { backgroundColor: '#E5F5FF' } : {}}>
                {pathname === '/pending-test' ?
                    <Image className="" src='/icons/pending-test.svg' alt="Pending Test Icon" width={5000} height={5000} loading="lazy" />
                    :
                    <Image className="" src='/icons/un-select-pending-test.svg' alt="Pending Test Icon" width={5000} height={5000} loading="lazy" />
                }
                <p className="menu-text" style={pathname === '/pending-test' ? { color: '#009CF9' } : {}}>Pending Test</p>
            </Link>

            <Link href={photo ? "/identity-profile/sample-facial-capture" : "/identity-profile/id-detection/step-1"} className="sub-menu" style={pathname === '/bac' ? { backgroundColor: '#E5F5FF' } : {}}>
                {pathname === '/bac' ?
                    <Image className="" src='/icons/bac-icon.svg' alt="BAC Icon" width={5000} height={5000} loading="lazy" />
                    :
                    <Image className="" src='/icons/un-select-bac.svg' alt="BAC Icon" width={5000} height={5000} loading="lazy" />
                }
                <p className="menu-text" style={pathname === '/bac' ? { color: '#009CF9' } : {}}>Bac Test</p>
            </Link>

            <Link href="/tutorial" className="sub-menu" style={pathname === '/tutorial' ? { backgroundColor: '#E5F5FF' } : {}}>
                {pathname === '/tutorial' ?
                    <Image className="" src='/icons/tutorial-selected.svg' alt="captured Image" width={5000} height={5000} loading="lazy" />
                    :
                    <Image className="" src='/icons/tutorial-un-selected.svg' alt="captured Image" width={5000} height={5000} loading="lazy" />
                }
                <p className="menu-text" style={pathname === '/tutorial' ? { color: '#009CF9' } : {}}>Tutorials</p>
            </Link>

            <Link href={"history"} className="sub-menu" style={pathname === '/history' ? { backgroundColor: '#E5F5FF' } : {}}>
                {pathname === '/history' ?
                    <Image className="" src='/icons/history.svg' alt="history Icon" width={5000} height={5000} loading="lazy" />
                    :
                    <Image className="" src='/icons/un-select-history.svg' alt="history Icon" width={5000} height={5000} loading="lazy" />
                }
                <p className="menu-text" style={pathname === '/history' ? { color: '#009CF9' } : {}}>History</p>
            </Link>

            <Link href={"what-new"} className="sub-menu" style={pathname === '/what-new' ? { backgroundColor: '#E5F5FF' } : {}}>
                {pathname === '/what-new' ?
                    <Image className="" src='/icons/whats-new.svg' alt="What`s New Icon" width={5000} height={5000} loading="lazy" />
                    :
                    <Image className="" src='/icons/un-sellect-whatnew-icon.svg' alt="What`s New Icon" width={5000} height={5000} loading="lazy" />
                }
                <p className="menu-text" style={pathname === '/what-new' ? { color: '#009CF9' } : {}}>What`s New</p>
            </Link>

            <Link href="/settings" className="sub-menu" style={pathname === '/settings' ? { backgroundColor: '#E5F5FF' } : {}}>
                {pathname === '/settings' ?
                    <Image className="" src='/icons/settings-selected.svg' alt="captured Image" width={5000} height={5000} loading="lazy" />
                    :
                    <Image className="" src='/icons/settings-un-selected.svg' alt="captured Image" width={5000} height={5000} loading="lazy" />
                }
                <p className="menu-text" style={pathname === '/settings' ? { color: '#009CF9' } : {}}>Settings</p>
            </Link>

            <Link href="/support" className="sub-menu" style={pathname === '/support' ? { backgroundColor: '#E5F5FF' } : {}}>
                {pathname === '/support' ?
                    <Image className="" src='/icons/support-selected.svg' alt="captured Image" width={5000} height={5000} loading="lazy" />
                    :
                    <Image className="" src='/icons/support-un-selected.svg' alt="captured Image" width={5000} height={5000} loading="lazy" />
                }
                <p className="menu-text" style={pathname === '/support' ? { color: '#009CF9' } : {}}>Support</p>
            </Link>

            <Button classname="logout-btn-dextop-menu" onClick={() => {
                dispatch(appDataDump())
                dispatch(clearTestData())
                dispatch(logout())
                router.push('/auth/sign-in')
            }}>
                <Image src='/icons/exit-door.svg' alt='exit-icon' width={20} height={20} />
                <p>Logout</p>
            </Button>

        </nav>
    );
};

export default DextopMenu;
