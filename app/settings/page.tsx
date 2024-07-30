"use client";

import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoNewspaperOutline } from "react-icons/io5";
import { IoIosPaper } from "react-icons/io";
import { RxExit } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppHeader, Menu, ReadOnlyInput, Setting, Button } from "@/components";
import { logout } from "@/redux/slices/auth";
import { appData, appDataDump, userIdString } from "@/redux/slices/appConfig";
import { authToken } from "@/redux/slices/auth";
import { clearTestData } from '@/redux/slices/drugTest';

function Settings() {
    const dispatch = useDispatch();
    const router = useRouter();

    const { first_name, last_name, email } = useSelector(appData);
    const { participant_id } = useSelector(authToken);
    const userId = useSelector(userIdString) ?? '/images/user-avi.png';

    return (
        <div className="container">
            <div className="items-wrap">
                <div className="settings-header">
                    <AppHeader title="Settings" />
                    <Button classname="logout-btn" onClick={() => {
                        dispatch(appDataDump())
                        dispatch(clearTestData())
                        dispatch(logout())
                        router.push('/auth/sign-in')
                    }}>
                        <Image src='/icons/exit-door.svg' alt='exit-icon' width={20} height={20} />
                        <p>Logout</p>
                    </Button>
                </div>
                <div className="user-avi">
                    <Image src={userId} width={3000} height={3000} alt='Proof User Avi' className="avi" loading='lazy' />
                </div>
                <section className="settings-section">
                    <h4 className="set-sec-title">Personal Information</h4>
                    <ReadOnlyInput label="Name" value={`${first_name} ${last_name}`} />
                    <ReadOnlyInput label="Email" value={email} />
                    <ReadOnlyInput label="Participant ID" value={participant_id as string} />
                </section>
                <section className="settings-section">
                    <h4 className="set-sec-title">Account</h4>
                    <Setting icon={<Image src='/icons/gear.svg' alt='exit-icon' width={32} height={32} />} title=" Application Settings" link='/settings/application-settings' />
                    <Setting icon={<Image src='/icons/bust.svg' alt='exit-icon' width={26} height={26} />} title="Deactivate My Account" link='https://collectwithproof.com/contact-us' />
                </section>
                <section className="settings-section">
                    <h4 className="set-sec-title">About</h4>
                    <Setting icon={<Image src='/icons/privacy.svg' alt='exit-icon' width={32} height={32} />} title="Privacy Policy" link='/settings/privacy-policy' />
                    <Setting icon={<Image src='/icons/terms.svg' alt='exit-icon' width={32} height={32} />} title="Terms and Conditions" link='https://www.recoverytrek.com/terms-of-use' />
                </section>
            </div>
            <div className="menu-wrapper-style">
                <Menu />
            </div>
        </div>
    )
};

export default Settings;