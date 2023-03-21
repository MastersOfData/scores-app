import type { Metadata } from "next/types";
import "../styles/globals.css";
import { StateProvider } from "./provider";
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
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
