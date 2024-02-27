import { Tag } from "./tag";

export interface Recipe {
    id: string;
    title: string;
    image: string;
    tags: Tag[];
}