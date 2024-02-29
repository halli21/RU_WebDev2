import { Tag } from "./tag";

export interface Recipe {
    _id: string;
    title: string;
    image: string;
    tags: Tag[];
    recipeType: string;
}

