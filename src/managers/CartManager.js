import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ValidationError, NotFoundError } from '../utils/errors.js';
<<<<<<< HEAD
import CartModel from '../models/Cart.js';
import ProductModel from '../models/Product.js';
=======
>>>>>>> master/master

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultCartsPath = path.join(__dirname, '../../data/carts.json');

class CartManager {
  constructor(storagePath) {
<<<<<<< HEAD
    // if a storagePath is provided, keep using file-based persistence (tests, fallback)
    this.useFile = Boolean(storagePath);
=======
>>>>>>> master/master
    this.carts = [];
    this.nextId = 1;
    this.cartsPath = storagePath || defaultCartsPath;
  }

  async initialize() {
<<<<<<< HEAD
    if (this.useFile) {
      try {
        const data = await fs.readFile(this.cartsPath, 'utf-8');
        this.carts = JSON.parse(data);
        if (this.carts.length > 0) {
          this.nextId = Math.max(...this.carts.map(c => {
            const id = typeof c.id === 'string' ? parseInt(c.id) : c.id;
            return isNaN(id) ? 0 : id;
          })) + 1;
        }
      } catch (error) {
        this.carts = [];
        this.nextId = 1;
        await this.saveCarts();
      }
=======
    try {
      const data = await fs.readFile(this.cartsPath, 'utf-8');
      this.carts = JSON.parse(data);
      if (this.carts.length > 0) {
        this.nextId = Math.max(...this.carts.map(c => {
          const id = typeof c.id === 'string' ? parseInt(c.id) : c.id;
          return isNaN(id) ? 0 : id;
        })) + 1;
      }
    } catch (error) {
      this.carts = [];
      this.nextId = 1;
      await this.saveCarts();
>>>>>>> master/master
    }
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
<<<<<<< HEAD
    if (this.useFile) {
      const newCart = {
        id: this.nextId++,
        products: []
      };
      this.carts.push(newCart);
      await this.saveCarts();
      return newCart;
    }

    const cart = await CartModel.create({ products: [] });
    return cart.toObject();
  }

  async getCartById(id) {
    if (this.useFile) {
      return this.carts.find(c => c.id == id);
    }

    const cart = await CartModel.findById(id).populate('products.product').lean();
    return cart;
=======
    const newCart = {
      id: this.nextId++,
      products: []
    };

    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async getCartById(id) {
    return this.carts.find(c => c.id == id);
>>>>>>> master/master
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationError('Cantidad inválida');
    }
<<<<<<< HEAD

    if (this.useFile) {
      const cart = this.carts.find(c => c.id == cartId);
      if (!cart) {
        throw new NotFoundError('Carrito no encontrado');
      }

      const productInCart = cart.products.find(p => p.product == productId);
      if (productInCart) {
        productInCart.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await this.saveCarts();
      return cart;
    }

    const cart = await CartModel.findById(cartId);
=======
    const cart = this.carts.find(c => c.id == cartId);
>>>>>>> master/master
    if (!cart) {
      throw new NotFoundError('Carrito no encontrado');
    }

<<<<<<< HEAD
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
    if (this.useFile) {
      const cart = this.carts.find(c => c.id == cartId);
      if (!cart) {
        throw new NotFoundError('Carrito no encontrado');
      }
      cart.products = cart.products.filter(p => p.product != productId);
      await this.saveCarts();
      return cart;
    }

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

    if (this.useFile) {
      const cart = this.carts.find(c => c.id == cartId);
      if (!cart) {
        throw new NotFoundError('Carrito no encontrado');
      }
      cart.products = products.map(p => ({
        product: p.product,
        quantity: p.quantity ?? 1
      }));
      await this.saveCarts();
      return cart;
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

    if (this.useFile) {
      const cart = this.carts.find(c => c.id == cartId);
      if (!cart) {
        throw new NotFoundError('Carrito no encontrado');
      }
      const productInCart = cart.products.find(p => p.product == productId);
      if (!productInCart) {
        throw new NotFoundError('Producto no encontrado en el carrito');
      }
      productInCart.quantity = quantity;
      await this.saveCarts();
      return cart;
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
    if (this.useFile) {
      const cart = this.carts.find(c => c.id == cartId);
      if (!cart) {
        throw new NotFoundError('Carrito no encontrado');
      }
      cart.products = [];
      await this.saveCarts();
      return cart;
    }

    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundError('Carrito no encontrado');
    }
    cart.products = [];
    await cart.save();
    await cart.populate('products.product');
    return cart.toObject();
=======
    const productInCart = cart.products.find(p => p.product == productId);

    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity: quantity
      });
    }

    await this.saveCarts();
    return cart;
>>>>>>> master/master
  }
}

export default CartManager;
