import Head from "next/head";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";

import "~/styles/globals.css";
import { api } from "~/utils/api";
import Nav from "~/components/Nav";
import Sidebar from "~/components/Sidebar";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({ weight: ["400", "500", "700"], subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Memeory</title>
        <link rel="icon" href="/logo.svg" type="image/x-icon"></link>
      </Head>
      <div
        className={`flex h-screen flex-col gap-4 overflow-hidden p-4 ${poppins.className}`}
      >
        <Nav />
        <div className="flex min-h-0 flex-1 gap-4">
          <Sidebar />
          <div className="h-full w-full overflow-auto rounded-lg">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
      <Toaster />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
