import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthContextProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Score Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
