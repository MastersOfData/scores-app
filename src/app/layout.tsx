import type { Metadata } from "next/types";
import { StateProvider } from "./provider";
import { Poppins } from "next/font/google";
import "../styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  preload: true,
  variable: "--ff-primary",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Score Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={poppins.className}>
      <body>
        <StateProvider>
          {children}
        </StateProvider>
      </body>
    </html>
  );
}
