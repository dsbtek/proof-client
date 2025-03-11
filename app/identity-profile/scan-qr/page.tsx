"use client";

import {
  AppContainer,
  AppHeader,
  DesktopFooter,
  GenerateQRCode
} from "@/components";


const GenerateQrcode = () => {

  return (
    <>
    
    <AppContainer 
      header={<AppHeader title="Scan QR" hasMute={false} />}
      body={<GenerateQRCode />} 
      footer={
        <DesktopFooter
            onPagination={false}
            onLeftButton={false}
            onRightButton={false}
            btnLeftText={"Recapture"}
            onClickBtnLeftAction={() => {}}
            btnRightText={"Next"}
            onClickBtnRightAction={() => {}}
            btnRightLink={""}
        />
      } 
    />
  </>
  )}

  export default GenerateQrcode;
