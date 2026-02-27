import express from 'express';

const router = express.Router();

export const createViewsRouter = (productManager) => {
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