import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: null
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    size: {
      type: Number,
      min: 0,
      default: null
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
      index: true
    },
    images: {
      type: [String],
      default: []
    },
    coverImage: {
      type: String,
      trim: true,
      default: null
    },
    sku: {
      type: String,
      trim: true,
      default: undefined,
      set: (value) => {
        if (value === null || value === undefined) return undefined;
        const trimmedValue = String(value).trim();
        return trimmedValue ? trimmedValue : undefined;
      },
      unique: true,
      sparse: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    },
    autoDeletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
