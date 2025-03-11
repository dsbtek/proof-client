"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Toastify from "@/components/toastify";
import { usePathname } from "next/navigation";
import useResponsive from "@/hooks/useResponsive";
import { auth } from "@/redux/slices";

const environment = process.env.NODE_ENV;

export default function LayoutProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();
  const pathname = usePathname();
  const isDesktop = useResponsive();

  // Regular expression to match the /test-collection/[slug] pattern
  const isTestCollectionPage = /^\/test-collection\/[^/]+$/.test(pathname);

  const toastifyPosition = isTestCollectionPage ? "top-center" : "top-right";

  const isLoggedOut = store.getState().auth.loggedOut;
  return (
    <>
      {!isLoggedOut && <Toastify toastifyPosition={toastifyPosition} />}
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <>{children}</>
          {environment === "development" ? (
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          ) : null}
        </QueryClientProvider>
      </Provider>
    </>
  );
}
