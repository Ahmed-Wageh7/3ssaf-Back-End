import express from "express";

import { auth, authorize } from "../../middleware/auth.js";
import imageUpload, { requireCloudinary } from "../../middleware/multer.js";
import validate from "../../middleware/validate.js";
import validateObjectIdParam from "../../middleware/validate-object-id.js";
import asyncHandler from "../../utils/async-handler.js";
import productsService from "./products.service.js";
import { productSchema, stockSchema } from "./products.validation.js";

const router = express.Router();
const productImagesUpload = imageUpload.array("images", 6);

const normalizeProductPayload = (req, res, next) => {
  if (typeof req.body.images === "string") {
    const trimmedValue = req.body.images.trim();

    if (!trimmedValue) {
      req.body.images = [];
    } else if (trimmedValue.startsWith("[")) {
      try {
        req.body.images = JSON.parse(trimmedValue);
      } catch {
        req.body.images = [trimmedValue];
      }
    } else {
      req.body.images = [trimmedValue];
    }
  }

  if (req.body.images === undefined) {
    req.body.images = [];
  }

  next();
};

router.get("/products", asyncHandler(async (req, res) => {
  res.status(200).json(await productsService.listProducts(req.query));
}));

router.get("/products/category/:categoryId", validateObjectIdParam("categoryId"), asyncHandler(async (req, res) => {
  res.status(200).json(await productsService.getByCategory(req.params.categoryId, req.query));
}));

router.get("/products/subcategory/:subcategoryId", validateObjectIdParam("subcategoryId"), asyncHandler(async (req, res) => {
  res.status(200).json(await productsService.getBySubcategory(req.params.subcategoryId, req.query));
}));

router.get("/products/:id", validateObjectIdParam("id"), asyncHandler(async (req, res) => {
  res.status(200).json(await productsService.getProduct(req.params.id));
}));

router.post("/admin/products", auth, authorize("admin"), requireCloudinary, productImagesUpload, normalizeProductPayload, validate(productSchema), asyncHandler(async (req, res) => {
  res.status(201).json(await productsService.createProduct(req.body, req.files));
}));

router.put("/admin/products/:id", auth, authorize("admin"), validateObjectIdParam("id"), requireCloudinary, productImagesUpload, normalizeProductPayload, validate(productSchema), asyncHandler(async (req, res) => {
  res.status(200).json(await productsService.updateProduct(req.params.id, req.body, req.files));
}));

router.delete("/admin/products/:id", auth, authorize("admin"), validateObjectIdParam("id"), asyncHandler(async (req, res) => {
  res.status(200).json(await productsService.deleteProduct(req.params.id));
}));

router.patch(
  "/admin/products/:id/stock",
  auth,
  authorize("admin"),
  validateObjectIdParam("id"),
  validate(stockSchema),
  asyncHandler(async (req, res) => {
    res.status(200).json(await productsService.updateStock(req.params.id, req.body.stock));
  })
);

export default router;
