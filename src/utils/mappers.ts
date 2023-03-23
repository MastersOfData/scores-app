import { Game, User } from "src/fire-base/models";
import { GameInternal, WithId } from "src/types/types";

export const mapGameToInternal = (
  game: WithId<Game>,
  users: WithId<User>[]
): GameInternal => {
  const playerStatswithUserInfo = users.map((user) => {
    const player = game.players.find((u) => u.playerId === user.id);
    if (player) {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        points: player.points,
      };
    }
  });

  return {
    ...game,
    players: playerStatswithUserInfo,
  };
};
