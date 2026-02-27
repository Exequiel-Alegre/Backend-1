import express from 'express';

const router = express.Router();

export const createCartsRouter = (cartManager, productManager) => {
  // POST / - Crear nuevo carrito
  router.post('/', async (req, res) => {
    try {
      const newCart = await cartManager.createCart();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /:cid - Listar productos del carrito
  router.get('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartManager.getCartById(cid);

      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      // devolver la estructura completa del carrito
      res.json(cart);
    } catch (error) {
      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        // although GET shouldn't throw in our code, keep safety
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // POST /:cid/product/:pid - Agregar producto al carrito
  router.post('/:cid/product/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;

      // Verificar que el carrito existe
      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      // Verificar que el producto existe
      const product = await productManager.getProductById(pid);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // verificar stock
      if (product.stock <= 0) {
        return res.status(400).json({ error: 'Producto sin stock disponible' });
      }

      // decrementar stock en el product manager
      await productManager.updateProduct(pid, { stock: product.stock - 1 });

      const updatedCart = await cartManager.addProductToCart(cid, pid, 1);
      res.json(updatedCart);
    } catch (error) {
      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        const status = error.name === 'NotFoundError' ? 404 : 400;
        return res.status(status).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default router;
