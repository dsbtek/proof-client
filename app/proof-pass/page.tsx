'use client';
import { useEffect, useState } from 'react';
import { AiOutlineRight } from 'react-icons/ai';
import Link from 'next/link';
import {
    AppHeader,
    Button,
    SelectComponent,
    Loader_,
    AppContainer,
} from '@/components';
import { SingleValue } from 'react-select';
import {
    setReDirectToProofPass,
    setHistoryData,
    historyData,
    appData,
    setPageRedirect,
    userIdString,
} from '@/redux/slices/appConfig';
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { authToken } from '@/redux/slices/auth';
import { toast } from 'react-toastify';
import { hasPermission } from '@/utils/utils';
import { proofPassFilter } from '@/utils/appData';
import { useRouter } from 'next/navigation';
import useResponsive from '@/hooks/useResponsive';

interface Option {
    id: number;
    value: string;
    label: string;
}

export interface ProofPassData {
    id: number;
    submitted_on: string;
    service: string;
    result: string;
    panel: string;
    donorParticipantId: string;
    dateOfService: string;
    identity: string;
    collection: string;
}

const ProofPass = () => {
    const [selectedFilter, setSelectedFilter] = useState<Option | null>(null);
    const userPermissions = useSelector(appData);
    const permissions = userPermissions?.permissions;
    const dispatch = useDispatch();
    const { participant_id, pin } = useSelector(authToken);
    const history = useSelector(historyData);
    const user = useSelector(appData);
    const photo = useSelector(userIdString);
    // const photo = user?.photo;
    const isDesktop = useResponsive();
    const router = useRouter();
    const appPermissions = permissions ? permissions.split(';') : undefined;

    const updateRedirection = async () => {
        // dispatch(setReDirectToProofPass(true));
        dispatch(setPageRedirect('/proof-pass/proof-pass-upload'));
    };

    const handleFilterChange = (selectedOption: SingleValue<Option>) => {
        setSelectedFilter(selectedOption);
    };

    const filteredData = selectedFilter
        ? history?.dtests?.filter(
              (item: any) => item?.ServiceType === selectedFilter.value,
          )
        : history?.dtests;

    const {
        data: histData,
        isLoading,
        refetch,
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
        enabled: false,
        onSuccess: ({ data }) => {
            if (data.status === 'Success') {
                dispatch(setHistoryData({ ...data }));
            } else {
                console.error(`Error ${data.statusCode}: ${data.message}`);
            }
        },
        onError: (error) => {
            toast.error('Sorry, cannot fetch data.');
            console.error(error);
        },
    });

    useEffect(() => {
        const routeBasedOnScreenSize = () => {
            if (isDesktop) {
                router.push('/history');
            }
        };
        routeBasedOnScreenSize();
    }, [router, isDesktop]);

    // useEffect(() => {
    //   if (history.app_history === undefined) {
    //     refetch();
    //   }
    // }, [history, refetch]);

    return (
        <AppContainer
            header={<AppHeader title={''} hasMute={false} />}
            body={
                <div className="container">
                    <p
                        style={{
                            marginTop: '16px',
                            marginBottom: '16px',
                            color: '#4E555D',
                        }}
                    >
                        ADD New PROOFpass: Click the `Upload` button above to
                        add a new PROOFpass.
                    </p>
                    {hasPermission('UploadPROOFpass', permissions) && (
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
                            <Button blue onClick={updateRedirection}>
                                {'UPLOAD'}
                            </Button>
                        </Link>
                    )}
                    <p style={{ marginTop: '16px', color: '#4E555D' }}>
                        VIEW a PROOFpass: Click the `Filters` button below and
                        select the type of PROOFpass you want to find in your
                        list
                    </p>
                    {isLoading ? (
                        <Loader_ />
                    ) : (
                        <>
                            <SelectComponent
                                className="select-w"
                                data={proofPassFilter}
                                placeholder={'FILTERS'}
                                name={''}
                                value={selectedFilter}
                                onChange={handleFilterChange}
                            />
                            <div className="proof-pass-list-container">
                                {filteredData?.length > 0 ? (
                                    filteredData.map(
                                        (item: any, index: number) => (
                                            <div
                                                key={index}
                                                className={`proof-pass-list ${
                                                    item.DrugTestResultStatus
                                                        ? item.DrugTestResultStatus
                                                        : 'Inconclusive'
                                                }`}
                                            >
                                                <div className="wrap-proof-pass-item">
                                                    <p>{item.submitteddate}</p>
                                                    <p>{item.ServiceType}</p>
                                                    <p>
                                                        {item.DrugTestResultStatus
                                                            ? item.DrugTestResultStatus
                                                            : 'Not Applicable'}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={`/proof-pass/${index}`}
                                                >
                                                    <AiOutlineRight />
                                                </Link>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <div className="no-results-message">
                                        No records found.
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            }
            footer={''}
        />
    );
};

export default ProofPass;
