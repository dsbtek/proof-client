import { BsMegaphone } from "react-icons/bs";
import Link from "next/link";
import Button from "../button";
import { appData } from "@/redux/slices/appConfig";
import { useSelector } from "react-redux";
import { hasPermission } from "@/utils/utils";


const HomeFooter = () => {
  const userPermissions = useSelector(appData);
  const permissions = userPermissions?.permissions
  return (

    <div className="new-feature">
      {hasPermission('PROOFPass', permissions) &&
        <Button blue link={"/proof-pass"}>
          PROOFpass
        </Button>
      }
    </div>
  );
};
export default HomeFooter;