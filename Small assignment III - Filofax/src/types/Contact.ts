import { ContactType } from './ContactType';

export interface Contact<T> {
    name: string;
    thumbnail: string;
    type: ContactType;
    info: T;
}