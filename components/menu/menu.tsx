'use client'

import { GoHome } from "react-icons/go";
import { BsMortarboardFill } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { usePathname } from "next/navigation";
import Link from "next/link";

import "./menu.css";


const Menu = () => {
  const pathname = usePathname();

  return (
    <nav className="menu">
      <Link href="/home" className="sub-menu">
        <GoHome size={30} color={pathname === '/home' ? '#009CF9' : '#ADADAD'} />
        <p className="menu-text" style={pathname === '/home' ? { color: '#009CF9' } : {}}>Home</p>
      </Link>
      <Link href="/tutorial" className="sub-menu">
        <BsMortarboardFill size={30} color={pathname === '/tutorial' ? '#009CF9' : '#ADADAD'} />
        <p className="menu-text" style={pathname === '/tutorial' ? { color: '#009CF9' } : {}}>Tutorials</p>
      </Link>
      <Link href="/support" className="sub-menu">
        <BsFillPersonCheckFill size={30} color={pathname === '/support' ? '#009CF9' : '#ADADAD'} />
        <p className="menu-text" style={pathname === '/support' ? { color: '#009CF9' } : {}}>Support</p>
      </Link>
      <Link href="/settings" className="sub-menu">
        <IoSettingsOutline size={30} color={pathname === '/settings' ? '#009CF9' : '#ADADAD'} />
        <p className="menu-text" style={pathname === '/settings' ? { color: '#009CF9' } : {}}>Settings</p>
      </Link>
    </nav>
  );
};

export default Menu;
