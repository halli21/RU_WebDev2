import { ContactType } from './ContactType';

export class Contact<T> {
    name: string;
    thumbnail: string;
    type: ContactType;
    info: T;
  
    constructor(name: string, thumbnail: string, type: ContactType, info: T) {
        this.name = name;
        this.thumbnail = thumbnail;
        this.type = type;
        this.info = info;
    }
}