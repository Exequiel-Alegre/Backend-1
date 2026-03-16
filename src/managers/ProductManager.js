import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ValidationError, DuplicateError, NotFoundError } from '../utils/errors.js';
import ProductModel from '../models/Product.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultProductsPath = path.join(__dirname, '../../data/products.json');

class ProductManager {
  constructor(storagePath) {
    // if a storagePath is provided, keep using file-based persistence (tests, fallback)
    this.useFile = Boolean(storagePath);
    this.products = [];
    this.nextId = 1;
    this.productsPath = storagePath || defaultProductsPath;
  }

  async initialize() {
    if (this.useFile) {
      try {
        const data = await fs.readFile(this.productsPath, 'utf-8');
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
  }

  async saveProducts() {
    // simple in-memory mutex to serialize writes from this instance
    if (this._writePromise) {
      await this._writePromise;
    }
    this._writePromise = (async () => {
      try {
        const dir = path.dirname(this.productsPath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(this.productsPath, JSON.stringify(this.products, null, 2));
      } catch (error) {
        console.error('Error al guardar productos:', error);
      } finally {
        this._writePromise = null;
      }
    })();
    return this._writePromise;
  }

  async getAllProducts() {
    if (this.useFile) {
      return this.products;
    }

    return ProductModel.find().lean();
  }

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    if (this.useFile) {
      // basic in-memory pagination / filtering
      let results = [...this.products];

      if (query) {
        const [key, value] = query.includes(':') ? query.split(':') : ['category', query];
        if (key === 'status') {
          const boolVal = value === 'true';
          results = results.filter(p => Boolean(p.status) === boolVal);
        } else if (key === 'category') {
          results = results.filter(p => String(p.category).toLowerCase() === String(value).toLowerCase());
        }
      }

      if (sort) {
        const direction = sort === 'asc' ? 1 : -1;
        results.sort((a, b) => (a.price - b.price) * direction);
      }

      const total = results.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const currentPage = Math.min(Math.max(1, page), totalPages);

      const payload = results.slice((currentPage - 1) * limit, currentPage * limit);
      return { payload, totalPages, total, page: currentPage };
    }

    const filter = {};
    if (query) {
      const [key, value] = query.includes(':') ? query.split(':') : ['category', query];
      if (key === 'status') {
        filter.status = value === 'true';
      } else if (key === 'category') {
        filter.category = value;
      }
    }

    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : null;

    const total = await ProductModel.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    const queryBuilder = ProductModel.find(filter)
      .skip((currentPage - 1) * limit)
      .limit(limit);

    if (sortOption) {
      queryBuilder.sort(sortOption);
    }

    const payload = await queryBuilder.lean();

    return { payload, totalPages, total, page: currentPage };
  }

  async getProductById(id) {
    if (this.useFile) {
      return this.products.find(p => p.id == id);
    }
    return ProductModel.findById(id).lean();
  }

  async addProduct(productData) {
    // basic presence checks
    if (!productData.title || !productData.description || !productData.code ||
        productData.price === undefined || productData.stock === undefined) {
      throw new ValidationError('Faltan campos requeridos del producto');
    }

    // type/constraint validation
    if (typeof productData.price !== 'number' || productData.price < 0) {
      throw new ValidationError('El precio debe ser un número mayor o igual a 0');
    }
    if (!Number.isInteger(productData.stock) || productData.stock < 0) {
      throw new ValidationError('El stock debe ser un entero mayor o igual a 0');
    }
    if (productData.thumbnails !== undefined) {
      if (!Array.isArray(productData.thumbnails) ||
          productData.thumbnails.some(t => typeof t !== 'string')) {
        throw new ValidationError('thumbnails debe ser un arreglo de cadenas');
      }
    }

    if (this.useFile) {
      // codigo único
      if (this.products.some(p => p.code === productData.code)) {
        throw new DuplicateError(`Código "${productData.code}" ya existe`);
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

    // Mongo mode
    const existing = await ProductModel.findOne({ code: productData.code });
    if (existing) {
      throw new DuplicateError(`Código "${productData.code}" ya existe`);
    }

    const created = await ProductModel.create({
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: productData.price,
      status: productData.status !== undefined ? productData.status : true,
      stock: productData.stock,
      category: productData.category || '',
      thumbnails: productData.thumbnails || []
    });

    return created.toObject();
  }

  async updateProduct(id, updateData) {
    if (this.useFile) {
      const productIndex = this.products.findIndex(p => p.id == id);
      if (productIndex === -1) {
        throw new NotFoundError('Producto no encontrado');
      }

      // No permitir actualizar el ID
      delete updateData.id;

      // validate some fields when updating
      if (updateData.price !== undefined) {
        if (typeof updateData.price !== 'number' || updateData.price < 0) {
          throw new ValidationError('El precio debe ser un número mayor o igual a 0');
        }
      }
      if (updateData.stock !== undefined) {
        if (!Number.isInteger(updateData.stock) || updateData.stock < 0) {
          throw new ValidationError('El stock debe ser un entero mayor o igual a 0');
        }
      }
      if (updateData.thumbnails !== undefined) {
        if (!Array.isArray(updateData.thumbnails) ||
            updateData.thumbnails.some(t => typeof t !== 'string')) {
          throw new ValidationError('thumbnails debe ser un arreglo de cadenas');
        }
      }
      if (updateData.code !== undefined) {
        // ensure code uniqueness (ignoring current product)
        const existing = this.products.find(p => p.code === updateData.code && p.id != id);
        if (existing) {
          throw new DuplicateError(`Código "${updateData.code}" ya existe`);
        }
      }

      const updatedProduct = {
        ...this.products[productIndex],
        ...updateData
      };

      this.products[productIndex] = updatedProduct;
      await this.saveProducts();
      return updatedProduct;
    }

    // Mongo mode
    if (updateData.id) {
      delete updateData.id;
    }
    if (updateData.price !== undefined) {
      if (typeof updateData.price !== 'number' || updateData.price < 0) {
        throw new ValidationError('El precio debe ser un número mayor o igual a 0');
      }
    }
    if (updateData.stock !== undefined) {
      if (!Number.isInteger(updateData.stock) || updateData.stock < 0) {
        throw new ValidationError('El stock debe ser un entero mayor o igual a 0');
      }
    }
    if (updateData.thumbnails !== undefined) {
      if (!Array.isArray(updateData.thumbnails) ||
          updateData.thumbnails.some(t => typeof t !== 'string')) {
        throw new ValidationError('thumbnails debe ser un arreglo de cadenas');
      }
    }
    if (updateData.code !== undefined) {
      const existing = await ProductModel.findOne({ code: updateData.code, _id: { $ne: id } });
      if (existing) {
        throw new DuplicateError(`Código "${updateData.code}" ya existe`);
      }
    }

    const updated = await ProductModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!updated) {
      throw new NotFoundError('Producto no encontrado');
    }
    return updated;
  }

  async deleteProduct(id) {
    if (this.useFile) {
      const productIndex = this.products.findIndex(p => p.id == id);
      if (productIndex === -1) {
        throw new Error('Producto no encontrado');
      }

      const deletedProduct = this.products[productIndex];
      this.products.splice(productIndex, 1);
      await this.saveProducts();
      return deletedProduct;
    }

    const deleted = await ProductModel.findByIdAndDelete(id).lean();
    if (!deleted) {
      throw new Error('Producto no encontrado');
    }
    return deleted;
  }
}

export default ProductManager;
