import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';
import { createProductsRouter } from './routes/products.js';
import { createCartsRouter } from './routes/carts.js';
import { createViewsRouter } from './routes/views.js';

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// create http + socket server later
let io;

  // Middleware (increase security with body size limits)
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // motor de vistas Handlebars
  app.engine('handlebars', engine({ layoutsDir: path.join(__dirname, 'views/layouts'), defaultLayout: 'main' }));
  app.set('view engine', 'handlebars');
  app.set('views', path.join(__dirname, 'views'));

  // recursos estáticos (si se necesitan más adelante)
  app.use(express.static(path.join(__dirname, 'public')));

// Inicializar managers
const productManager = new ProductManager();
const cartManager = new CartManager();

// Inicializar y arrancar el servidor
async function startServer() {
  try {
    // Inicializar managers con los datos persistidos
    await productManager.initialize();
    await cartManager.initialize();

    // Crear routers (pasar io para emitir eventos en endpoints)
    const productsRouter = createProductsRouter(productManager, io);
    const cartsRouter = createCartsRouter(cartManager, productManager);
    const viewsRouter = createViewsRouter(productManager);

    // Rutas
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    // vistas handlebars
    app.use('/', viewsRouter);

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

    // Iniciar servidor http (para socket.io)
    const server = http.createServer(app);
    io = new SocketIOServer(server);

    // sockets
    io.on('connection', async (socket) => {
      console.log('Cliente conectado:', socket.id);
      // enviar lista inicial
      socket.emit('productsUpdated', await productManager.getAllProducts());

      socket.on('createProduct', async (prodData) => {
        try {
          await productManager.addProduct(prodData);
          const products = await productManager.getAllProducts();
          io.emit('productsUpdated', products);
        } catch (err) {
          socket.emit('error', err.message);
        }
      });

      socket.on('deleteProduct', async (id) => {
        try {
          await productManager.deleteProduct(id);
          const products = await productManager.getAllProducts();
          io.emit('productsUpdated', products);
        } catch (err) {
          socket.emit('error', err.message);
        }
      });
    });

    server.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
