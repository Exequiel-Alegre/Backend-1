import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import CartModel from '../models/Cart.js';
import ProductModel from '../models/Product.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultCartsPath = path.join(__dirname, '../../data/carts.json');

class CartManager {
  constructor(storagePath) {
    this.carts = [];
    this.nextId = 1;
    this.cartsPath = storagePath || defaultCartsPath;
  }

  async initialize() {
    // No initialization needed for MongoDB mode
    return;
  }

  async saveCarts() {
    // serialize writes in this instance to avoid concurrent file corruption
    if (this._writePromise) {
      await this._writePromise;
    }
    this._writePromise = (async () => {
      try {
        const dir = path.dirname(this.cartsPath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(this.cartsPath, JSON.stringify(this.carts, null, 2));
      } catch (error) {
        console.error('Error al guardar carritos:', error);
      } finally {
        this._writePromise = null;
      }
    })();
    return this._writePromise;
  }

  async createCart() {
    const cart = await CartModel.create({ products: [] });
    return cart.toObject();
  }

  async getCartById(id) {
    const cart = await CartModel.findById(id).populate('products.product').lean();
    return cart;
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationError('Cantidad inválida');
    }

    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundError('Carrito no encontrado');
    }

    const existing = cart.products.find(p => p.product.toString() === productId.toString());
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('products.product');
    return cart.toObject();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundError('Carrito no encontrado');
    }

    cart.products = cart.products.filter(p => p.product.toString() !== productId.toString());
    await cart.save();
    await cart.populate('products.product');
    return cart.toObject();
  }

  async updateCartProducts(cartId, products = []) {
    if (!Array.isArray(products)) {
      throw new ValidationError('El arreglo de productos es inválido');
    }

    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundError('Carrito no encontrado');
    }

    cart.products = products.map(p => ({
      product: p.product,
      quantity: p.quantity ?? 1
    }));

    await cart.save();
    await cart.populate('products.product');
    return cart.toObject();
  }

  async updateProductQuantity(cartId, productId, quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationError('Cantidad inválida');
    }

    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundError('Carrito no encontrado');
    }

    const productInCart = cart.products.find(p => p.product.toString() === productId.toString());
    if (!productInCart) {
      throw new NotFoundError('Producto no encontrado en el carrito');
    }

    productInCart.quantity = quantity;
    await cart.save();
    await cart.populate('products.product');
    return cart.toObject();
  }

  async clearCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundError('Carrito no encontrado');
    }
    cart.products = [];
    await cart.save();
    await cart.populate('products.product');
    return cart.toObject();
  }
}

export default CartManager;
