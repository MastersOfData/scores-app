import type { Metadata } from "next/types";
import Header from "src/components/Header";
import "../styles/globals.css";
import { StateProvider } from "./provider";

export const metadata: Metadata = {
  title: "Score Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <div className='page-container'>
          <div className='content-wrapper'>
            <StateProvider>
              <Header />
              {children}
            </StateProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
