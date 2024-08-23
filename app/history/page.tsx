"use client";
import { useEffect, useState } from "react";
import {
  Menu,
  AppHeader,
  Button,
  Loader_,
  DinamicMenuLayout,
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
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiCalendar,
  FiClock,
  FiPackage,
  FiSearch,
} from "react-icons/fi";
import CustomTable from "@/components/custom-table";
import { TabBar } from "@/components/tab";
import FilterDropdown from "@/components/filter-dropdown";
import HistoryModal from "@/components/modals/historyModal";

interface Record {
  dateTime: string;
  deviceType: string;
  ipAddress: string;
  location: string;
  loginStatus: "Successful" | "Failed";
}

const History = () => {
  const dispatch = useDispatch();
  const { participant_id, pin } = useSelector(authToken);
  const history = useSelector(historyData);
  const userPermissions = useSelector(appData);
  const permissions = userPermissions?.permissions;
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

  return (
    <DinamicMenuLayout>
      <div className="card" style={{ padding: "1.5rem" }}>
        <div className="dex-only title-sub-container">
          <h4 className="set-sec-title">History</h4>
          <p className="settings-title-subtext">
            Showing all your test histories, including dates, and results.
          </p>
        </div>
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
              </div>
            </div>
            <div>
              <div className="history-card">
                <div className="flex-row history-card-title-row">
                  <h4>PROOF Collection</h4>
                  <FiArrowUpRight onClick={() => setShowModal(!showModal)} />
                </div>
                <div className="flex-row">
                  <div className="flex-row">
                    <FiCalendar size={24} />
                    <p>05/03/2024</p>
                  </div>
                  <div className="flex-row">
                    <FiClock size={24} />
                    <p>10:19 AM</p>
                  </div>
                </div>
                <div className="flex-row">
                  <Image
                    className="dex-only"
                    src="/icons/billing.svg"
                    alt="billing"
                    width={24}
                    height={24}
                    loading="lazy"
                  />

                  <p>05/03/2024</p>
                </div>
                <Badge type="positive" text="Positive" />
              </div>
            </div>
          </div>
        ) : activeTab === 1 ? (
          <CustomTable records={testRecord} />
        ) : (
          <CustomTable records={records} />
        )}
      </div>
      <HistoryModal show={showModal} onClose={() => setShowModal(!showModal)} />
    </DinamicMenuLayout>
  );
};

export default History;
