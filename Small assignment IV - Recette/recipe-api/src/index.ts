import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { execUsingMongoClient } from "./db/conn";
import { ObjectId } from "mongodb";
import { Recipe } from "./types/database-types";
import recipes from "./population/recipes.json";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);

app.get("/recipes", async (req: Request, res: Response) => {
  await execUsingMongoClient(async (db) => {
    const recipes = await db?.collection("recipes").find({}).toArray();
    return res.json(
      recipes.map((r) => ({
        _id: r._id,
        title: r.title,
        image: r.image,
        recipeType: r.recipeType,
        tags: r.tags,
      }))
    );
  });
});

app.get("/recipes/recipeTypes", async (req: Request, res: Response) => {
  await execUsingMongoClient(async (db) => {
    const recipeTypes = await db?.collection("recipeTypes").find({}).toArray();
    return res.json(recipeTypes);
  });
});

app.get("/populate", async (req: Request, res: Response) => {
  await execUsingMongoClient(async (db) => {
    const collections = await db?.collections();

    if (collections?.find((c) => c.collectionName === "recipeTypes")) {
      // Drop collection - if exists.
      await db?.dropCollection("recipeTypes");
    }

    await db
      ?.collection("recipeTypes")
      .insertMany([
        { name: "Appetizers" },
        { name: "Starters" },
        { name: "Main Courses" },
        { name: "Side dishes" },
        { name: "Desserts" },
      ]);

    const recipeTypes = await db?.collection("recipeTypes").find({}).toArray();

    if (collections?.find((c) => c.collectionName === "recipes")) {
      // Drop collection - if exists.
      await db?.dropCollection("recipes");
    }

    await db?.collection("recipes").insertMany(
      (recipes as any).map((r: any) => ({
        ...r,
        recipeType: recipeTypes?.find((rt) => rt.name === r.recipeType)?._id,
        image: Buffer.from(r.image, "base64"),
      })) as any
    );

    return res.send("Database populated.");
  });
});

app.get("/recipes/:recipeId", async (req: Request, res: Response) => {
  const { recipeId } = req.params;
  await execUsingMongoClient(async (db) => {
    try {
      const recipe = await db?.collection<Recipe>("recipes").findOne({
        _id: new ObjectId(recipeId),
      });

      if (!recipe) {
        return res.status(404).send(`Recipe ${recipeId} was not found`);
      }

      return res.json(recipe);
    } catch (ex: any) {
      return res.status(500).send(ex.message);
    }
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
