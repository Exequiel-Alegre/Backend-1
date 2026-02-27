import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ValidationError, NotFoundError } from '../utils/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultCartsPath = path.join(__dirname, '../../data/carts.json');

class CartManager {
  constructor(storagePath) {
    this.carts = [];
    this.nextId = 1;
    this.cartsPath = storagePath || defaultCartsPath;
  }

  async initialize() {
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
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationError('Cantidad inválida');
    }
    const cart = this.carts.find(c => c.id == cartId);
    if (!cart) {
      throw new NotFoundError('Carrito no encontrado');
    }

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
  }
}

export default CartManager;
