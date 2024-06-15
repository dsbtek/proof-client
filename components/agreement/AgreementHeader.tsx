import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

import { AppHeader } from "@/components";

interface AgreementHeaderProps {
  title: string;
}

const AgreementHeader = ({ title }: AgreementHeaderProps) => {
  return (
    <div className="agreement-header-container">
      <AppHeader title={title} />
      <div className="icon-container">
        {
          <Image
            src="/images/sound.png"
            alt="sound"
            width={20}
            height={20}
            loading='lazy'
          />
        }
      </div>
    </div>
  );
};

export default AgreementHeader;
