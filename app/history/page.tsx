'use client'
import { useEffect, useState } from "react";
import { Menu, AppHeader, Button, Loader_ } from "@/components";
import { AiOutlineRight } from "react-icons/ai";
import { useQuery } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { authToken } from "@/redux/slices/auth";
import { setHistoryData, historyData, appData } from "@/redux/slices/appConfig";
import { toast } from "react-toastify";




const History = () => {
  const dispatch = useDispatch();
  const { participant_id, pin } = useSelector(authToken);
  const history = useSelector(historyData);

  const { data: histData, isLoading, refetch } = useQuery("history", {
    queryFn: async () => {
      const response = await fetch("/api/history", {
        method: 'POST',
        headers: {
          participant_id: participant_id as string,
          pin: pin as string
        }
      })
      const data = await response.json();
      return data;
    },
    enabled: false,
    onSuccess: ({ data }) => {
      console.log(data)
      if (data.status === "Success") {
        dispatch(setHistoryData({ ...data }));
      } else {
        console.error(`Error ${data.statusCode}: ${data.message}`);
      }
    },
    onError: (error) => {
      toast.error("Sorry Cannot Fetch Data");
      console.error(error)
    }
  });


  useEffect(() => {
    if (history.app_history === undefined) {
      refetch();
    }
  }, [history, refetch]);

  return (
    <div className="container">
      <AppHeader title="History" />
      <br />
      {isLoading ?
        <Loader_ />
        :
        <>
          <Button
            onClick={() => console.log("Login clicked")}
            classname="history-button"
            link="/history/login-history"
          >
            <span>Login</span>
            <AiOutlineRight />
          </Button>
          <Button
            onClick={() => console.log("BAC Test clicked")}
            classname="history-button"
            link="/proof-pass"
          >
            <span> Test</span>
            <AiOutlineRight />
          </Button>
          <Button
            onClick={() => console.log("BAC Test clicked")}
            classname="history-button"
            link="/history/bac-test-history"
          >
            <span>BAC Test</span>
            <AiOutlineRight />
          </Button>

          <Button
            onClick={() => console.log("BAC Test clicked")}
            classname="history-button"
            link="/history"
          >
            <span>Prescriptions</span>
            <AiOutlineRight />
          </Button>

          <Button
            onClick={() => console.log("BAC Test clicked")}
            classname="history-button"
            link="/history"
          >
            <span>Calls</span>
            <AiOutlineRight />
          </Button>
        </>

      }
      <div className="menu-wrapper-style">
        <Menu />
      </div>
    </div>
  );
};

export default History;
