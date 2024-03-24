import { Question } from "./question";
import { User } from "./user";
import { Answer } from "./answer";
import { MatchStatus } from "./match-status";


export interface Match {
    id: string;
    title: string;
    titleImage: string;
    questions: Question[]
    owner: User;
    answers: Answer[];
    players: User[];
    status: MatchStatus;
}