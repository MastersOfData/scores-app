import { FC } from "react";
import PageWrapper from "src/components/PageWrapper";

interface ManagePageProps {
  params: { groupId: string };
}

const ManageGroupPage: FC<ManagePageProps> = ({ params }) => {
  const { groupId } = params;
  return <PageWrapper title="Gruppenavn" backPath="/group"></PageWrapper>;
};
