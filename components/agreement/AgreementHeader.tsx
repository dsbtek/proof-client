import Image from "next/image";

import { AppHeader } from "@/components";
import { GoMute } from "react-icons/go";
import { RxSpeakerLoud } from "react-icons/rx";

interface AgreementHeaderProps {
  title: string;
  onClickMute?: () => void;
  muted?: boolean;
}

const AgreementHeader = ({
  title,
  onClickMute,
  muted = true,
}: AgreementHeaderProps) => {
  return (
    <div className="agreement-header-container">
      <AppHeader title={title} />
      <div className="icon-container" onClick={onClickMute}>
        {
          // <Image
          //   src="/images/sound.png"
          //   alt="sound"
          //   width={20}
          //   height={20}
          //   loading='lazy'
          // />
          muted ? (
            <GoMute color="#adadad" style={{ cursor: "pointer" }} size={18} />
          ) : (
            <RxSpeakerLoud
              color="#009cf9"
              style={{ cursor: "pointer" }}
              size={18}
            />
          )
        }
      </div>
    </div>
  );
};

export default AgreementHeader;
