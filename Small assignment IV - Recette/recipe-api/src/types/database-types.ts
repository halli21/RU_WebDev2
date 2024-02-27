import { ObjectId } from "mongodb";

export interface Recipe {
  _id: ObjectId;
  title: string;
  description: string;
  author: string;
  image: string;
  recipeType: string;
  tags: Tag[];
  instructions: Instruction[];
  ingredients: Ingredient[];
}

export interface RecipeType {
  _id: ObjectId;
  name: string;
}

export interface Tag {
  key: string;
  value: string;
}

export interface Instruction {
  step: number;
  description: string;
}

export interface Ingredient {
  ingredient: string;
}
