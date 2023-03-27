import { Group, User, Membership } from "../fire-base/models";
import { GroupInternal, Member, WithId } from "../types/types";

export const mapGroupAndUsersToGroupInternal = (
  group: WithId<Group>,
  userGroupStats: WithId<Membership>[],
  users: WithId<User>[]
): GroupInternal => {
  const statsWithUserInfo: Member[] = [];

  userGroupStats.forEach((stats) => {
    const user = users.find((u) => u.id === stats.userId);
    if (user) {
      statsWithUserInfo.push({ ...stats, ...user });
    }
  });

  return {
    ...group,
    members: statsWithUserInfo,
  };
};
