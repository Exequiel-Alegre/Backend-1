import express from 'express';

const router = express.Router();

export const createProductsRouter = (productManager) => {
  // GET / - Listar todos los productos
  router.get('/', async (req, res) => {
    try {
      const products = await productManager.getAllProducts();
      res.json(products);
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

      res.status(201).json(newProduct);
    } catch (error) {
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
      res.json({ message: 'Producto eliminado correctamente', product: deletedProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default router;
