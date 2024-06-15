import { NextResponse, type NextRequest } from "next/server";
import axios from "@/utils/axios";

export async function POST(request: NextRequest) {
  try {
    // Parsing the request body
    const body = await request.json();

    const requestHeaders = {
      participant_id: body.participant_id,
      pin: body.pin,
      Collectiondate: body.Collectiondate,
      firstvax: body.firstvax,
      secondvax: body.secondvax,
      service_type: body.service_type,
      vaxbrand: body.vaxbrand,
      result: body.result,
      panel: body.panel,
      specimen_id: body.panel,
      list_panel: body.list_panel,
      booster_shot_date: body.booster_shot_date,
      booster_shot_brand: body.booster_shot_brand,
      result_percentage: body.result_percentage,
      type_exemption: body.type_exemption,
      detail_exemption: body.detail_exemption,
      agree_disagree: body.agree_disagree,
      alco_result: body.alco_result,
      rapidkit_id_barcode: body.rapidkit_id_barcode,
      rapidkit_shipping_barcode: body.rapidkit_shipping_barcode,
      strip_result_history: body.strip_result_history,
      proof_id: body.proof_id,
      government_photo_url: body.government_photo_url,
      passport_photo_url: body.passport_photo_url,
      face_scan1_percentage: body.face_scan1_percentage,
      face_scan1_url: body.face_scan1_url,
      first_name: body.first_name,
      last_name: body.last_name,
      middle_name: body.middle_name,
      date_of_birth: body.birth_date,
      address: body.Address_Line_1,
      city: body.City,
      state: body.State,
      zipcode: body.Zip_Code,
      imagenames: body.imagenames,
    };

    const res = await axios.post(
      "/proofupload",
      { images: body?.scanReport },
      { headers: requestHeaders }
    );
    if (res.status === 200) {
      return NextResponse.json({ data: res.data }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: res.data.message },
        { status: res.status }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.msg || error.message },
      { status: 500 }
    );
  }
}
