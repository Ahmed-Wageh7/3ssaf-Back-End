import Cart from "../../database/model/cart.model.js";
import Product from "../../database/model/product.model.js";
import AppError from "../../utils/app-error.js";

const calculateTotals = (cart) => {
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return cart;
};

const consolidateItems = (cart) => {
  const itemsByProduct = new Map();

  for (const item of cart.items) {
    const productId = String(item.product?._id ?? item.product);
    const existingItem = itemsByProduct.get(productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.price = item.price;
      continue;
    }

    itemsByProduct.set(productId, item);
  }

  cart.items = [...itemsByProduct.values()];
  return calculateTotals(cart);
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findOne({ _id: productId, isDeleted: false });
  if (!product) throw new AppError("Product not found", 404);
  if (quantity > product.stock) throw new AppError("Requested quantity exceeds stock", 400);

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find((item) => String(item.product) === String(productId));

  if (existingItem) {
    const totalQuantity = existingItem.quantity + quantity;
    if (totalQuantity > product.stock) {
      throw new AppError("Requested quantity exceeds stock", 400);
    }
    existingItem.quantity = totalQuantity;
    existingItem.price = product.price;
  } else {
    cart.items.push({
      product: product._id,
      quantity,
      price: product.price
    });
  }

  consolidateItems(cart);
  await cart.save();

  return { message: "Item added to cart", cart };
};

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  consolidateItems(cart);
  await cart.save();
  await cart.populate("items.product");
  return { cart };
};

const updateCartItem = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((entry) => String(entry.product) === String(productId));
  if (!item) throw new AppError("Item not found in cart", 404);

  const product = await Product.findOne({ _id: productId, isDeleted: false });
  if (!product) throw new AppError("Product not found", 404);
  if (quantity > product.stock) throw new AppError("Requested quantity exceeds stock", 400);

  item.quantity = quantity;
  item.price = product.price;

  consolidateItems(cart);
  await cart.save();

  return { message: "Cart item updated", cart };
};

const removeCartItem = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((item) => {
    const itemProductId = String(item.product?._id ?? item.product);
    const itemLineId = String(item._id);

    return itemProductId !== String(productId) && itemLineId !== String(productId);
  });
  calculateTotals(cart);
  await cart.save();

  return { message: "Cart item removed", cart };
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  return { message: "Cart cleared", cart };
};

export default {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
