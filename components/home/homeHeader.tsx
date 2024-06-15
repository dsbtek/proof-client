"use client";

import { useSelector } from "react-redux";

import { appData } from "@/redux/slices/appConfig";

interface HomeHeaderProps {
  title: string;
  greetings: string;
}

const HomeHeader = ({ title, greetings }: HomeHeaderProps) => {
  const { first_name, last_name } = useSelector(appData);
  return (
    <div className="home-header">
      <div className="home-title">
        <h1>{title}</h1>
      </div>
      <div className="user-home">
        <p className="greet-text">{greetings}</p>
        <p className="user-name">
          {first_name + ' ' + last_name}
        </p>
      </div>
    </div>
  );
};

export default HomeHeader;
