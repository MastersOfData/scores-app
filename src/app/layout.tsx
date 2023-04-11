import type { Metadata } from "next/types";
import Providers from "./providers";
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
  manifest: "/manifest.json"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={poppins.className}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
