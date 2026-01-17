import express from 'express';
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';
import { createProductsRouter } from './routes/products.js';
import { createCartsRouter } from './routes/carts.js';

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar managers
const productManager = new ProductManager();
const cartManager = new CartManager();

// Inicializar y arrancar el servidor
async function startServer() {
  try {
    // Inicializar managers con los datos persistidos
    await productManager.initialize();
    await cartManager.initialize();

    // Crear routers
    const productsRouter = createProductsRouter(productManager);
    const cartsRouter = createCartsRouter(cartManager, productManager);

    // Rutas
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);

    // Ruta base para verificar que el servidor está funcionando
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Servidor de E-commerce activo',
        endpoints: {
          products: '/api/products',
          carts: '/api/carts'
        }
      });
    });

    // Manejo de rutas no encontradas
    app.use((req, res) => {
      res.status(404).json({ error: 'Ruta no encontrada' });
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
