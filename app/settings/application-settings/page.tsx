"use client";

import { useState } from "react";
import Cookies from "js-cookie";

import { AppHeader, Switch } from "@/components";
import { setCookie } from "@/utils/utils";

function ApplicationSettings() {
    const welcomeCookie = Cookies.get("welView");
    const [checked, setChecked] = useState(welcomeCookie === 'true' ? true : false);
    const handleSwitch = () => {
        if (welcomeCookie === 'false') {
            setCookie('welView', 'true', 2000);
            setChecked(true)
        } else {
            setCookie('welView', 'false', 2000);
            setChecked(false)
        }
    };
    return (
        <div className="container">
            <div className="items-wrap">
                <AppHeader title="Application Settings" />
                <div className="toggle-tutorial">
                    <p>Show Welcome Tutorial</p>
                    <Switch onToggle={handleSwitch} checked={checked} />
                </div>
            </div>
        </div>
    )
};

export default ApplicationSettings;