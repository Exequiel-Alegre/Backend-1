import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cartsPath = path.join(__dirname, '../../data/carts.json');

class CartManager {
  constructor() {
    this.carts = [];
    this.nextId = 1;
  }

  async initialize() {
    try {
      const data = await fs.readFile(cartsPath, 'utf-8');
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
    try {
      const dir = path.dirname(cartsPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(cartsPath, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error('Error al guardar carritos:', error);
    }
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
    const cart = this.carts.find(c => c.id == cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
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
