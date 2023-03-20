"use client";

import type { Metadata } from "next/types";
import { Provider } from "react-redux";
import { store } from "../store/store";
import "../styles/globals.css";

// export const metadata: Metadata = {
//   title: "Score Tracker",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <html lang='en'>
        <body>
          <div className='page-container'>
            <div className='content-wrapper'>{children}</div>
          </div>
        </body>
      </html>
    </Provider>
  );
}
