import express from 'express';

const router = express.Router();

export const createViewsRouter = (productManager, cartManager) => {
  // Vista de productos paginados, filtrados y ordenados
  router.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 5;
    const page = parseInt(req.query.page, 10) || 1;
    const sort = req.query.sort === 'asc' || req.query.sort === 'desc' ? req.query.sort : undefined;
    const query = typeof req.query.query === 'string' && req.query.query.trim() !== '' ? req.query.query.trim() : undefined;

    const { payload: products, totalPages, page: currentPage, hasPrevPage, hasNextPage } = await productManager.getProducts({ limit, page, sort, query });

    const buildLink = (targetPage) => {
      const params = new URLSearchParams({ ...req.query, page: targetPage });
      return `${req.baseUrl}/products?${params.toString()}`;
    };

    res.render('index', {
      title: 'Productos',
      products,
      pagination: {
        totalPages,
        currentPage,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? buildLink(currentPage - 1) : null,
        nextLink: hasNextPage ? buildLink(currentPage + 1) : null,
        query: req.query
      }
    });
  });

  // Detalle de producto
  router.get('/products/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    res.render('productDetails', { title: product.title, product });
  });

  const populateCart = async (cart) => {
    if (!cart || !Array.isArray(cart.products)) return cart;
    const populated = await Promise.all(cart.products.map(async (item) => {
      const product = await productManager.getProductById(item.product);
      return {
        product: product || { id: item.product },
        quantity: item.quantity
      };
    }));
    return { ...cart, products: populated };
  };

  // Vista de carrito
  router.get('/carts/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    const populated = await populateCart(cart);
    res.render('cart', { title: `Carrito ${cart._id || cart.id}`, cart: populated });
  });

  // página estática que lista productos sin websocket
  router.get('/home', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('home', { title: 'Home', products });
  });

  // vista en tiempo real
  router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('realTimeProducts', { title: 'Real Time Products', products });
  });

  return router;
};

export default router;
