import express from 'express';

const router = express.Router();

export const createCartsRouter = (cartManager, productManager) => {
<<<<<<< HEAD
  const populateCart = async (cart) => {
    if (!cart) return null;
    if (!cart.products || !Array.isArray(cart.products)) {
      return cart;
    }

    const populated = await Promise.all(cart.products.map(async (item) => {
      const product = await productManager.getProductById(item.product);
      return {
        product: product || { id: item.product },
        quantity: item.quantity
      };
    }));

    return {
      ...cart,
      products: populated
    };
  };

=======
>>>>>>> master/master
  // POST / - Crear nuevo carrito
  router.post('/', async (req, res) => {
    try {
      const newCart = await cartManager.createCart();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

<<<<<<< HEAD
  // GET /:cid - Listar productos del carrito (populated)
=======
  // GET /:cid - Listar productos del carrito
>>>>>>> master/master
  router.get('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartManager.getCartById(cid);

      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

<<<<<<< HEAD
      const populated = await populateCart(cart);
      res.json(populated);
    } catch (error) {
      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
=======
      // devolver la estructura completa del carrito
      res.json(cart);
    } catch (error) {
      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        // although GET shouldn't throw in our code, keep safety
>>>>>>> master/master
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  });

<<<<<<< HEAD
  // DELETE /:cid - Eliminar todos los productos del carrito
  router.delete('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      const cleared = await cartManager.clearCart(cid);
      res.json({ message: 'Carrito vaciado', cart: cleared });
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /:cid/products/:pid - Eliminar un producto específico del carrito
  router.delete('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      const removed = await cartManager.removeProductFromCart(cid, pid);
      res.json({ message: 'Producto eliminado del carrito', cart: removed });
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // PUT /:cid - Reemplazar todos los productos del carrito
  router.put('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      if (!Array.isArray(products)) {
        return res.status(400).json({ error: 'Se espera un arreglo de productos' });
      }

      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      const updated = await cartManager.updateCartProducts(cid, products);
      res.json({ message: 'Carrito actualizado', cart: updated });
    } catch (error) {
      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // PUT /:cid/products/:pid - Actualizar cantidad de un producto en el carrito
  router.put('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      const updated = await cartManager.updateProductQuantity(cid, pid, quantity);
      res.json({ message: 'Cantidad actualizada', cart: updated });
    } catch (error) {
      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        const status = error.name === 'NotFoundError' ? 404 : 400;
        return res.status(status).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  });

=======
>>>>>>> master/master
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
