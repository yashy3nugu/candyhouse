import { AppProps, type AppType } from "next/app";
import { api } from "@/utils/api";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { Provider } from "react-redux";
import { store } from "@/store";
import AppProvider from "@/components/provider/app-provider";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Provider store={store}>
        <AppProvider>
          <ChakraProvider>
            {getLayout(<Component {...pageProps} />)}
          </ChakraProvider>
        </AppProvider>
      </Provider>
    </>
  );
};

export default api.withTRPC(MyApp);
