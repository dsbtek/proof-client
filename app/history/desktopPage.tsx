'use client';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { FiArrowUpRight, FiCalendar, FiClock } from 'react-icons/fi';
import { WiCloudUp } from 'react-icons/wi';
import Link from 'next/link';

import {
    Button,
    Loader_,
    DinamicMenuLayout,
    TabBar,
    SearchInput,
    FilterDropDown,
    HistoryModal,
    CustomTable,
    Badge,
} from '@/components';
import { authToken } from '@/redux/slices/auth';
import {
    setHistoryData,
    historyData,
    appData,
    setReDirectToProofPass,
    setPageRedirect,
    userIdString,
} from '@/redux/slices/appConfig';
import { hasPermission } from '@/utils/utils';

interface Record {
    dateTime: string;
    deviceType: string;
    ipAddress: string;
    location: string;
    loginStatus: 'Successful' | 'Failed';
}

const records = [
    {
        dateTime: '2024-07-01 10:15',
        deviceType: 'Desktop',
        ipAddress: '192.168.1.1',
        location: 'New York, USA',
        loginStatus: 'Successful',
    },
    {
        dateTime: '2024-07-02 14:45',
        deviceType: 'MacBook',
        ipAddress: '192.168.1.2',
        location: 'London, UK',
        loginStatus: 'Failed',
    },
    {
        dateTime: '2024-07-03 09:00',
        deviceType: 'Laptop',
        ipAddress: '192.168.1.3',
        location: 'Toronto, CA',
        loginStatus: 'Successful',
    },
    {
        dateTime: '2024-07-04 12:30',
        deviceType: 'Tablet',
        ipAddress: '192.168.1.4',
        location: 'Sydney, AU',
        loginStatus: 'Successful',
    },
];

const DesktopHistory = () => {
    const dispatch = useDispatch();
    const { participant_id, pin } = useSelector(authToken);
    const history = useSelector(historyData);
    const userPermissions = useSelector(appData);
    const permissions = userPermissions?.permissions;
    const user = useSelector(appData);
    // const photo = user?.photo;
    const photo = useSelector(userIdString);
    const appPermissions = permissions ? permissions.split(';') : undefined;
    const [searchValue, setSearchValue] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [modalData, setModdalData] = useState<any>();
    const handleFilterChange = (selectedOption: string) => {
        setSelectedFilter(selectedOption);
    };

    const filteredTestRecord = useMemo(
        () =>
            selectedFilter
                ? history?.dtests?.filter(
                      (item: any) => item?.ServiceType === selectedFilter,
                  )
                : searchValue
                ? history?.dtests?.filter(
                      (i: any) =>
                          i?.ServiceType ||
                          i?.serviceDate ||
                          i?.DrugTestResultStatus ||
                          i?.ParticipantID === searchValue,
                  )
                : history?.dtests,
        [searchValue, selectedFilter, history?.dtests],
    );

    const loginRecords = history?.checkinstatus;

    const bacRecords = history?.bactests;

    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [{ title: 'Test' }, { title: 'BAC Test' }, { title: 'Login' }];

    const handleTabPress = (index: number) => {
        setActiveTab(index);
    };

    const options = [
        { label: 'Drug Test Results', value: 'drugTestResults' },
        { label: 'OralTox Kit Test', value: 'oralToxKitTest' },
        { label: 'PROOF Collection', value: 'PROOFCollection' },
    ];

    const {
        data: histData,
        isLoading,
        // refetch,
    } = useQuery('history', {
        queryFn: async () => {
            const response = await fetch('/api/history', {
                method: 'POST',
                headers: {
                    participant_id: participant_id as string,
                    pin: pin as string,
                },
            });
            const data = await response.json();
            return data;
        },
        // enabled: false,
        onSuccess: ({ data }) => {
            console.log(data);
            if (data.status === 'Success') {
                dispatch(setHistoryData({ ...data }));
            } else {
                console.error(`Error ${data.statusCode}: ${data.message}`);
            }
        },
        onError: (error) => {
            toast.error('Sorry Cannot Fetch Data');
            console.error(error);
        },
    });

    // useEffect(() => {
    //   if (history.app_history === undefined) {
    //     refetch();
    //   }
    // }, [history, refetch]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        console.log(e);
        setSearchValue(e.target?.value);
    };

    const updateRedirection = async () => {
        // dispatch(setReDirectToProofPass(true));
        dispatch(setPageRedirect('/proof-pass/proof-pass-upload'));
    };

    return (
        <DinamicMenuLayout>
            <div
                className="card"
                style={{
                    padding: '1.5rem',
                    overflowY: 'hidden',
                    backgroundColor: '#F4F7F8',
                }}
            >
                <div className="dex-only title-sub-container">
                    <h1 className="set-sec-title">History</h1>
                    <p className="settings-title-subtext">
                        Showing all your test histories, including dates, and
                        results.
                    </p>
                </div>
                {isLoading ? (
                    <Loader_ />
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            overflowY: 'hidden',
                        }}
                    >
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
                                        value={searchValue}
                                        placeholder="Search by Name, ID, Date..."
                                        onChange={onChange}
                                        className="history-search"
                                    />
                                    <div className="flex-row">
                                        <FilterDropDown
                                            title={selectedFilter || 'Filter'}
                                            options={options}
                                            onOptionSelect={(option) => {
                                                console.log(
                                                    'Selected option:',
                                                    option,
                                                );
                                                setSelectedFilter(
                                                    option?.label,
                                                );
                                            }}
                                            onClearFilter={() =>
                                                setSelectedFilter('')
                                            }
                                            className="my-custom-dropdown"
                                            dropdownClassName="custom-dropdown-menu"
                                            optionClassName="custom-dropdown-option"
                                        />
                                        {hasPermission(
                                            'UploadPROOFpass',
                                            permissions,
                                        ) && (
                                            <Link
                                                className="links"
                                                href={
                                                    photo &&
                                                    !appPermissions.includes(
                                                        'ID Capture with Rear Camera',
                                                    )
                                                        ? '/identity-profile/sample-facial-capture'
                                                        : photo &&
                                                          appPermissions.includes(
                                                              'ID Capture with Rear Camera',
                                                          )
                                                        ? '/identity-profile/id-detection/id-capture'
                                                        : '/identity-profile'
                                                }
                                            >
                                                <Button
                                                    blue
                                                    classname=""
                                                    type="submit"
                                                    style={{
                                                        width: '149px',
                                                        height: '48px',
                                                        fontSize: '1rem',
                                                    }}
                                                    onClick={updateRedirection}
                                                    // link="/proof-pass"
                                                >
                                                    <WiCloudUp size={24} />{' '}
                                                    PROOFPass
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="tests-grid-container">
                                    {filteredTestRecord?.length > 0 ? (
                                        filteredTestRecord?.map(
                                            (item: any, index: number) => (
                                                <div
                                                    className="history-card"
                                                    key={index}
                                                >
                                                    <div className="flex-row history-card-title-row">
                                                        <h4>
                                                            {item?.ServiceType}
                                                        </h4>
                                                        <FiArrowUpRight
                                                            onClick={() => {
                                                                setModdalData({
                                                                    ...item,
                                                                    id: index,
                                                                });
                                                                setShowModal(
                                                                    !showModal,
                                                                );
                                                            }}
                                                            size={20}
                                                            color="#4E555D"
                                                            className="clickable-icon-hover"
                                                        />
                                                    </div>
                                                    <div
                                                        className="flex-row"
                                                        style={{ gap: '16px' }}
                                                    >
                                                        <div className=" history-card-icon-text">
                                                            <FiCalendar
                                                                size={22}
                                                                style={{
                                                                    strokeWidth: 1.5,
                                                                }}
                                                            />
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        '18px',
                                                                }}
                                                            >
                                                                {
                                                                    item?.submitteddate?.split(
                                                                        ' ',
                                                                    )[0]
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="history-card-icon-text">
                                                            <FiClock
                                                                size={22}
                                                                style={{
                                                                    strokeWidth: 1.5,
                                                                }}
                                                            />
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        '18px',
                                                                }}
                                                            >
                                                                {
                                                                    item?.submitteddate?.split(
                                                                        ' ',
                                                                    )[1]
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex-row history-card-icon-text">
                                                        <Image
                                                            className="dex-only"
                                                            src="/icons/browser-stack.svg"
                                                            alt="billing"
                                                            width={22}
                                                            height={22}
                                                            loading="lazy"
                                                        />

                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    '18px',
                                                            }}
                                                        >
                                                            {item?.TestPanel ||
                                                                'unknown'}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        type={
                                                            item?.DrugTestResultStatus ||
                                                            'Inconclusive'
                                                        }
                                                        text={
                                                            item?.DrugTestResultStatus ||
                                                            'Inconclusive'
                                                        }
                                                    />
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <div className="no-results-message">
                                            {' '}
                                            <br /> <br />
                                            No records found.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : activeTab === 1 ? (
                            <CustomTable records={bacRecords} />
                        ) : (
                            <CustomTable records={loginRecords} />
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
