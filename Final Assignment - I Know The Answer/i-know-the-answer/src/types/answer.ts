import { User } from "./user";

export interface Answer {
    question: number;
    user: User;
    answer: number;
    secondsLeft: number;
}