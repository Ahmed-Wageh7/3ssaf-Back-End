import { Joi, objectId } from "../../utils/validation.js";

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow("", null),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  size: Joi.number().min(0).allow(null),
  category: objectId.required(),
  subcategory: objectId.required(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  coverImage: Joi.string().uri().allow("", null).default(null),
  sku: Joi.string().allow("", null)
});

const stockSchema = Joi.object({
  stock: Joi.number().integer().min(0).required()
});

export {
  productSchema,
  stockSchema
};
