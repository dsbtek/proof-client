"use client";

import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Suspense, useEffect } from "react";

import Toastify from "@/components/toastify";

const environment = process.env.NODE_ENV;

export default function LayoutProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const queryClient = new QueryClient();


  return (
    <>
      <Toastify />
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <div className="main-wrap">
            <div className="layout">{children}</div>
          </div>
          {environment === "development" ? (
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          ) : null}
        </QueryClientProvider>
      </Provider>
    </>
  );
}