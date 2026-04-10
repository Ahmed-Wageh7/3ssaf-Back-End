import mongoose from "mongoose";
import dotenv from "dotenv";

import Category from "../src/database/model/category.model.js";
import Subcategory from "../src/database/model/subcategory.model.js";

dotenv.config({ path: "./config/.env" });

const categoriesData = [
  {
    name: "Buy 2 get third free",
    description: "Buy 2 items and get the third one free"
  },
  {
    name: "Buy 1 get two free",
    description: "Buy 1 item and get two free"
  },
  { name: "Assaf Discounts", description: "Special discounts from Assaf" },
  { name: "Perfumes", description: "Fragrances and perfumes" },
  { name: "Assaf Watches", description: "Assaf branded watches" },
  { name: "Care Products", description: "Personal care products" },
  { name: "Assaf Sunglasses", description: "Assaf sunglasses collection" },
  { name: "Assaf Bags", description: "Assaf bags collection" },
  { name: "Home", description: "Home collection" }
];

const subcategoriesData = [
  { name: "Buy 2 get third free", categoryName: "Buy 2 get third free" },
  { name: "Buy 1 get two free", categoryName: "Buy 1 get two free" },
  { name: "Arrogate Collection", categoryName: "Perfumes" },
  { name: "art-of-detecation-perfumes", categoryName: "Perfumes" },
  { name: "pegasus collection", categoryName: "Perfumes" },
  { name: "Topacco collection", categoryName: "Perfumes" },
  { name: "Dokhur collection", categoryName: "Perfumes" },
  { name: "Enable Collection", categoryName: "Perfumes" },
  { name: "Gift of Nobles", categoryName: "Perfumes" },
  { name: "lady collection", categoryName: "Perfumes" },
  { name: "High constdiration collection", categoryName: "Perfumes" },
  { name: "morning collection", categoryName: "Perfumes" },
  { name: "new collection", categoryName: "Perfumes" },
  { name: "Perfumes-200ml-150ml", categoryName: "Perfumes" },
  { name: "Pheromone", categoryName: "Perfumes" },
  { name: "pink-collection", categoryName: "Perfumes" },
  { name: "Private Collection", categoryName: "Perfumes" },
  { name: "Special Offers", categoryName: "Perfumes" },
  { name: "Summer collection", categoryName: "Perfumes" },
  { name: "Perfumers'-Choices", categoryName: "Perfumes" },
  { name: "The New Covenant-2026", categoryName: "Perfumes" },
  { name: "Niche-Group", categoryName: "Perfumes" },
  { name: "wild-colt-collection", categoryName: "Perfumes" },
  { name: "winter-collection", categoryName: "Perfumes" },
  { name: "women sunglasses", categoryName: "Assaf Sunglasses" },
  { name: "men sunglasses", categoryName: "Assaf Sunglasses" },
  { name: "women", categoryName: "Assaf Bags" },
  { name: "children", categoryName: "Assaf Bags" },
  { name: "promise bag", categoryName: "Assaf Bags" },
  { name: "classic watches", categoryName: "Assaf Watches" },
  { name: "women's watches", categoryName: "Assaf Watches" },
  { name: "sports Watches", categoryName: "Assaf Watches" },
  { name: "care", categoryName: "Care Products" },
  { name: "home disc", categoryName: "Assaf Discounts" },
  { name: "top releases", categoryName: "Home" },
  { name: "Assaf Discouns", categoryName: "Assaf Discounts" },
  { name: "The-Art-Dedication-home", categoryName: "Home" },
  { name: "view third section home", categoryName: "Home" },
  { name: "fragrances-home", categoryName: "Home" },
  { name: "New Era Begins", categoryName: "Home" },
  { name: "Next Chapter", categoryName: "Home" },
  { name: "Arrogate-home", categoryName: "Home" },
  { name: "gift-benz", categoryName: "Home" },
  { name: "wild-benz", categoryName: "Home" },
  { name: "men perfumes", categoryName: "Home" },
  { name: "women women", categoryName: "Home" },
  { name: "new chapter", categoryName: "Home" },
  { name: "discovery-set", categoryName: "Home" }
];

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from config/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });

  console.log(`MongoDB connected to ${mongoose.connection.name}`);

  try {
    const insertedCategories = [];

    for (const categoryData of categoriesData) {
      const category = await Category.findOneAndUpdate(
        { name: categoryData.name },
        { $set: categoryData },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      insertedCategories.push(category);
    }

    console.log(`Categories upserted: ${insertedCategories.length}`);

    let subcategoriesCount = 0;

    for (const subcategoryData of subcategoriesData) {
      const category = insertedCategories.find((item) => item.name === subcategoryData.categoryName);

      if (!category) {
        throw new Error(`Category not found for subcategory: ${subcategoryData.name}`);
      }

      await Subcategory.findOneAndUpdate(
        { name: subcategoryData.name, category: category._id },
        {
          $set: {
            name: subcategoryData.name,
            description: subcategoryData.description || "",
            category: category._id
          }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      subcategoriesCount += 1;
    }

    console.log(`Subcategories upserted: ${subcategoriesCount}`);
    console.log("Seeding completed successfully");
  } finally {
    await mongoose.connection.close();
  }
};

seed().catch((error) => {
  console.error("Seeding failed");
  console.error(error);
  process.exit(1);
});
