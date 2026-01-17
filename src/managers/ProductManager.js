import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.join(__dirname, '../../data/products.json');

class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  async initialize() {
    try {
      const data = await fs.readFile(productsPath, 'utf-8');
      this.products = JSON.parse(data);
      if (this.products.length > 0) {
        this.nextId = Math.max(...this.products.map(p => {
          const id = typeof p.id === 'string' ? parseInt(p.id) : p.id;
          return isNaN(id) ? 0 : id;
        })) + 1;
      }
    } catch (error) {
      this.products = [];
      this.nextId = 1;
      await this.saveProducts();
    }
  }

  async saveProducts() {
    try {
      const dir = path.dirname(productsPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(productsPath, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error('Error al guardar productos:', error);
    }
  }

  async getAllProducts() {
    return this.products;
  }

  async getProductById(id) {
    return this.products.find(p => p.id == id);
  }

  async addProduct(productData) {
    if (!productData.title || !productData.description || !productData.code || 
        productData.price === undefined || productData.stock === undefined) {
      throw new Error('Faltan campos requeridos del producto');
    }

    const newProduct = {
      id: this.nextId++,
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: productData.price,
      status: productData.status !== undefined ? productData.status : true,
      stock: productData.stock,
      category: productData.category || '',
      thumbnails: productData.thumbnails || []
    };

    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const productIndex = this.products.findIndex(p => p.id == id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    // No permitir actualizar el ID
    delete updateData.id;

    const updatedProduct = {
      ...this.products[productIndex],
      ...updateData
    };

    this.products[productIndex] = updatedProduct;
    await this.saveProducts();
    return updatedProduct;
  }

  async deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id == id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    const deletedProduct = this.products[productIndex];
    this.products.splice(productIndex, 1);
    await this.saveProducts();
    return deletedProduct;
  }
}

export default ProductManager;
