import express from 'express';

const router = express.Router();

export const createProductsRouter = (productManager, io) => {
  // GET / - Listar productos con filtros/paginación/ordenamiento
  router.get('/', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const page = parseInt(req.query.page, 10) || 1;
      const sort = req.query.sort === 'asc' || req.query.sort === 'desc' ? req.query.sort : undefined;
      const query = typeof req.query.query === 'string' && req.query.query.trim() !== '' ? req.query.query.trim() : undefined;

      const { payload, totalPages, page: currentPage } = await productManager.getProducts({ limit, page, sort, query });

      const hasPrevPage = currentPage > 1;
      const hasNextPage = currentPage < totalPages;
      const prevPage = hasPrevPage ? currentPage - 1 : null;
      const nextPage = hasNextPage ? currentPage + 1 : null;

      const buildLink = (targetPage) => {
        const params = new URLSearchParams({ ...req.query, page: targetPage });
        return `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}?${params.toString()}`;
      };

      res.json({
        status: 'success',
        payload,
        totalPages,
        prevPage,
        nextPage,
        page: currentPage,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? buildLink(prevPage) : null,
        nextLink: hasNextPage ? buildLink(nextPage) : null
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /:pid - Obtener producto por ID
  router.get('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await productManager.getProductById(pid);
      
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST / - Crear nuevo producto
  router.post('/', async (req, res) => {
    try {
      const { title, description, code, price, status, stock, category, thumbnails } = req.body;

      if (!title || !description || !code || price === undefined || stock === undefined) {
        return res.status(400).json({ 
          error: 'Faltan campos requeridos: title, description, code, price, stock' 
        });
      }

      const newProduct = await productManager.addProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
      });

      // notificar vía websocket si está disponible
      if (io) {
        const all = await productManager.getAllProducts();
        io.emit('productsUpdated', all);
      }

      res.status(201).json(newProduct);
    } catch (error) {
      // use specific status codes for custom errors
      if (error.name === 'ValidationError' || error.name === 'DuplicateError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // PUT /:pid - Actualizar producto
  router.put('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const updateData = req.body;

      const product = await productManager.getProductById(pid);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const updatedProduct = await productManager.updateProduct(pid, updateData);
      res.json(updatedProduct);
    } catch (error) {
      if (error.name === 'ValidationError' || error.name === 'DuplicateError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /:pid - Eliminar producto
  router.delete('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;

      const product = await productManager.getProductById(pid);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const deletedProduct = await productManager.deleteProduct(pid);
      if (io) {
        const all = await productManager.getAllProducts();
        io.emit('productsUpdated', all);
      }
      res.json({ message: 'Producto eliminado correctamente', product: deletedProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default router;
