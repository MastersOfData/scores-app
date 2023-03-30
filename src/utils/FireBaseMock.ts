import { mockFirebase } from "firestore-jest-mock";
import { groupsCol, usersCol, gamesCol, userGroupStatisticsCol } from "../fire-base/db"
import { Group, User, Membership } from "src/fire-base/models";



const group1: Group = {
  name: "BestGroup",
  emoji: "🤓",
  games: ["sjakk"],
  invitationCode: "", 
  gameTypes: [],
};

const group2: Group =  {
  name: "SecondBestGroup", 
  emoji: "🤪", 
  games: ["Stigespill"], 
  invitationCode: "", 
  gameType: []
};

mockFirebase({
  database: {
    groupsCol: [
      {group: group1, id: "123"},
     {group: group2, id: "456"}
    ]
    //Kan legge inn flere documents her
  }
});
