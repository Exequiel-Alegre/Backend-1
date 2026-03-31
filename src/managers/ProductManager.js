import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ValidationError, DuplicateError, NotFoundError } from '../utils/errors.js';
import ProductModel from '../models/Product.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultProductsPath = path.join(__dirname, '../../data/products.json');

class ProductManager {
  constructor(storagePath) {
    this.products = [];
    this.nextId = 1;
    this.productsPath = storagePath || defaultProductsPath;
  }

  async initialize() {
    // No initialization needed for MongoDB mode
    return;
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
    return ProductModel.find().lean();
  }

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
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

    // Verificar código único
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
    // No permitir actualizar el ID
    if (updateData.id) {
      delete updateData.id;
    }

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
    const deleted = await ProductModel.findByIdAndDelete(id).lean();
    if (!deleted) {
      throw new Error('Producto no encontrado');
    }
    return deleted;
  }
}

export default ProductManager;
