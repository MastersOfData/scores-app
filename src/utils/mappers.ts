import { Group, User, Membership } from "../fire-base/models";
import { GroupInternal, WithId } from "../types/types";

export const mapGroupAndUsersToGroupInternal = (
  group: WithId<Group>,
  userGroupStats: WithId<Membership>[],
  users: WithId<User>[]
): GroupInternal => {
  const statsWithUserInfo = userGroupStats.map((stats) => {
    const user = users.find((u) => u.id === stats.userId);
    if (user) {
      return {
        ...stats,
        ...user,
      };
    }
  });

  return {
    ...group,
    members: statsWithUserInfo,
  };
};
