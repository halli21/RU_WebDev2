import { Question } from "./question";
import { User } from "./user";
import { Answer } from "./answer";
import { MatchStatus } from "./match-status";

export interface Match {
  _id: string;
  title: string;
  titleImage: string;
  questions: Question[];
  owner: Partial<User>;
  answers: Answer[];
  currentQuestion: number;
  players: User[];
  status: MatchStatus;
}
