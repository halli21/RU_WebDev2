import { User } from "./user";

export interface Answer {
    question: number;
    user: Partial<User>;
    answer: number;
    secondsLeft: number;
}