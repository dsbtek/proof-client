"use client";
import { useEffect, useState } from "react";
import {
  Menu,
  AppHeader,
  Button,
  Loader_,
  DinamicMenuLayout,
  Loader,
} from "@/components";
import { AiOutlineRight } from "react-icons/ai";
import { useQuery } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { authToken } from "@/redux/slices/auth";
import { setHistoryData, historyData, appData } from "@/redux/slices/appConfig";
import { toast } from "react-toastify";
import { hasPermission } from "@/utils/utils";
import Image from "next/image";
import Badge from "@/components/badge";
import SearchInput from "@/components/search-input";
import { FiArrowUpRight, FiCalendar, FiClock } from "react-icons/fi";
import { WiCloudUp } from "react-icons/wi";
import CustomTable from "@/components/custom-table";
import { TabBar } from "@/components/tab";
import FilterDropdown from "@/components/filter-dropdown";
import HistoryModal from "@/components/modals/historyModal";
import Link from "next/link";

interface Record {
  dateTime: string;
  deviceType: string;
  ipAddress: string;
  location: string;
  loginStatus: "Successful" | "Failed";
}

const records = [
  {
    dateTime: "2024-07-01 10:15",
    deviceType: "Desktop",
    ipAddress: "192.168.1.1",
    location: "New York, USA",
    loginStatus: "Successful",
  },
  {
    dateTime: "2024-07-02 14:45",
    deviceType: "MacBook",
    ipAddress: "192.168.1.2",
    location: "London, UK",
    loginStatus: "Failed",
  },
  {
    dateTime: "2024-07-03 09:00",
    deviceType: "Laptop",
    ipAddress: "192.168.1.3",
    location: "Toronto, CA",
    loginStatus: "Successful",
  },
  {
    dateTime: "2024-07-04 12:30",
    deviceType: "Tablet",
    ipAddress: "192.168.1.4",
    location: "Sydney, AU",
    loginStatus: "Successful",
  },
];

const testRecord = [
  {
    SubmittedDate: "2024-07-01 10:15",
    ImportedDate: "2024-07-01 10:15",
    TestResult: "0.0025",
    DeviceUsed: "Macbook",
    TestStatus: "Successful",
  },
  {
    SubmittedDate: "2024-07-01 10:15",
    ImportedDate: "2024-07-01 10:15",
    TestResult: "0.0025",
    DeviceUsed: "Macbook",
    TestStatus: "Negative",
  },
  {
    SubmittedDate: "2024-07-01 10:15",
    ImportedDate: "2024-07-01 10:15",
    TestResult: "0.0025",
    DeviceUsed: "Macbook",
    TestStatus: "Pending",
  },
];
const DesktopHistory = () => {
  const dispatch = useDispatch();
  const { participant_id, pin } = useSelector(authToken);
  const history = useSelector(historyData);
  const userPermissions = useSelector(appData);
  const permissions = userPermissions?.permissions;
  const user = useSelector(appData);
  const photo = user?.photo;

  const [selectedFilter, setSelectedFilter] = useState<String | null>(null);
  const [modalData, setModdalData] = useState<any>();
  const handleFilterChange = (selectedOption: String) => {
    setSelectedFilter(selectedOption);
  };

  const filteredTestRecord = selectedFilter
    ? history?.dtests?.filter(
        (item: any) => item?.ServiceType === selectedFilter
      )
    : history?.dtests;

  const bacRecords = history?.bactests;

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [{ title: "Test" }, { title: "BAC Test" }, { title: "Login" }];

  const handleTabPress = (index: number) => {
    setActiveTab(index);
  };

  const options = [
    { label: "Drug Test Results", value: "drugTestResults" },
    { label: "OralTox Kit Test", value: "oralToxKitTest" },
    { label: "Proof Collection", value: "proofCollection" },
  ];

  const {
    data: histData,
    isLoading,
    refetch,
  } = useQuery("history", {
    queryFn: async () => {
      const response = await fetch("/api/history", {
        method: "POST",
        headers: {
          participant_id: participant_id as string,
          pin: pin as string,
        },
      });
      const data = await response.json();
      return data;
    },
    enabled: false,
    onSuccess: ({ data }) => {
      console.log(data);
      if (data.status === "Success") {
        dispatch(setHistoryData({ ...data }));
      } else {
        console.error(`Error ${data.statusCode}: ${data.message}`);
      }
    },
    onError: (error) => {
      toast.error("Sorry Cannot Fetch Data");
      console.error(error);
    },
  });

  useEffect(() => {
    if (history.app_history === undefined) {
      refetch();
    }
  }, [history, refetch]);

  return (
    <DinamicMenuLayout>
      <div className="card" style={{ padding: "1.5rem" }}>
        <div className="dex-only title-sub-container">
          <h4 className="set-sec-title">History</h4>
          <p className="settings-title-subtext">
            Showing all your test histories, including dates, and results.
          </p>
        </div>
        {isLoading ? (
          <Loader_ />
        ) : (
          <div>
            <div className="history-tab">
              <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabPress={handleTabPress}
              />
            </div>
            {activeTab === 0 ? (
              <div>
                <div className="flex-row search-filter-upload">
                  <SearchInput
                    value=""
                    placeholder="Search by Name, ID, Date..."
                    onChange={() => {}}
                    className="history-search"
                  />
                  <div className="flex-row">
                    <FilterDropdown
                      title="Filter"
                      options={options}
                      onOptionSelect={(option) =>
                        console.log("Selected option:", option)
                      }
                      className="my-custom-dropdown"
                      dropdownClassName="custom-dropdown-menu"
                      optionClassName="custom-dropdown-option"
                    />
                    {hasPermission("UploadPROOFpass", permissions) && (
                      <Link
                        className="links"
                        href={
                          photo
                            ? "/identity-profile/sample-facial-capture"
                            : "/identity-profile/id-detection/step-1"
                        }
                      >
                        <Button
                          blue
                          classname=""
                          type="submit"
                          style={{
                            width: "149px",
                            height: "48px",
                            fontSize: "1rem",
                          }}
                          onClick={() => null}
                          // link="/proof-pass"
                        >
                          <WiCloudUp size={24} /> Upload New
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="tests-grid-container">
                  {filteredTestRecord?.length > 0 ? (
                    filteredTestRecord?.map((item: any, index: number) => (
                      <div className="history-card" key={index}>
                        <div className="flex-row history-card-title-row">
                          <h4>{item?.ServiceType}</h4>
                          <FiArrowUpRight
                            onClick={() => {
                              setModdalData(item);
                              setShowModal(!showModal);
                            }}
                            size={20}
                            color="#4E555D"
                            className="clickable-icon-hover"
                          />
                        </div>
                        <div className="flex-row">
                          <div className=" history-card-icon-text">
                            <FiCalendar
                              size={24}
                              style={{ strokeWidth: 1.5 }}
                            />
                            <p>{item?.submitteddate?.split(" ")[0]}</p>
                          </div>
                          <div className="history-card-icon-text">
                            <FiClock size={24} style={{ strokeWidth: 1.5 }} />
                            <p>{item?.submitteddate?.split(" ")[1]}</p>
                          </div>
                        </div>
                        <div className="flex-row history-card-icon-text">
                          <Image
                            className="dex-only"
                            src="/icons/browser-stack.svg"
                            alt="billing"
                            width={24}
                            height={24}
                            loading="lazy"
                          />

                          <p>{item?.TestPanel}</p>
                        </div>
                        <Badge
                          type={item?.DrugTestResultStatus || "Inconclusive"}
                          text={item?.DrugTestResultStatus || "Inconclusive"}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="no-results-message">No records found.</div>
                  )}
                </div>
              </div>
            ) : activeTab === 1 ? (
              <CustomTable records={bacRecords} />
            ) : (
              <CustomTable records={records} />
            )}
          </div>
        )}
      </div>
      <HistoryModal
        show={showModal}
        onClose={() => setShowModal(!showModal)}
        data={modalData}
      />
    </DinamicMenuLayout>
  );
};

export default DesktopHistory;
