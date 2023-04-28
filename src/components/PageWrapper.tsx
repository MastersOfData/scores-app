"use client";

import styles from "src/styles/PageWrapper.module.css";
import Header from "src/components/Header";
import { useRouter, usePathname } from "next/navigation";
import Spinner from "./Spinner";
import { useUser } from "src/services/user.service";

export type PageWrapperProps = {
  children?: React.ReactNode;
  title: string;
  authenticated?: boolean;
  backPath?: string;
  useHistoryBack?: boolean;
};

export default function PageWrapper({
  children,
  title,
  authenticated,
  backPath,
  useHistoryBack = false,
}: PageWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, user } = useUser();

  if (loading) return <Spinner />;

  if (!user && authenticated) {
    router.push(`/sign-in?callbackUrl=${pathname}`);
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <Header backPath={backPath} useHistoryBack={useHistoryBack}>
        {title}
      </Header>
      {children}
    </div>
  );
}
