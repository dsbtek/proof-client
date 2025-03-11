"use client";
import useGetDeviceInfo from "@/hooks/useGetDeviceInfo";
import DesktopScanLabReport from "./desktop";
import ScanLabReport from "./mobile";

interface ProofPassUploadType {
  participant_id: string;
  pin: string;
  Collectiondate: string;
  firstvax: string;
  secondvax: string;
  service_type: string;
  vaxbrand: string;
  result: string;
  panel: string;
  specimen_id: string;
  list_panel: string;
  booster_shot_date: string;
  booster_shot_brand: string;
  result_percentage: string;
  type_exemption: string;
  detail_exemption: string;
  agree_disagree: string;
  alco_result: string;
  rapidkit_id_barcode: string;
  rapidkit_shipping_barcode: string;
  strip_result_history: string;
  proof_id: string;
  government_photo_url: string;
  passport_photo_url: string;
  face_scan1_percentage: string | undefined;
  face_scan1_url: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  imagenames: string;
  scanReport: string;
}

const Page = () => {
  const device = useGetDeviceInfo();

  return (
    <>
      {device?.screenWidth > 700 ? <DesktopScanLabReport /> : <ScanLabReport />}
    </>
  );
};
export default Page;
