'use client'
import DextopMenu from "../menu/desktopMenu";
import Menu from "../menu/menu";
import "../menu/menu.css";


const DinamicMenuLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <div className="desktop-menu-layout">
            <div className="desktop-menu">
                <DextopMenu />
            </div>
            <div className="menu-page-wrap">
                {children}
                <div className="mobile-menu">
                    <Menu />
                </div>
            </div>
        </div>
    );
};

export default DinamicMenuLayout;
