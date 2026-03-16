import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';
<<<<<<< HEAD
import { connectMongo } from './db/mongoose.js';
import { createProductsRouter } from './routes/products.js';
import { createCartsRouter } from './routes/carts.js';
import { createViewsRouter } from './routes/views.js';
import ProductModel from './models/Product.js';
=======
import { createProductsRouter } from './routes/products.js';
import { createCartsRouter } from './routes/carts.js';
import { createViewsRouter } from './routes/views.js';
>>>>>>> master/master

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
<<<<<<< HEAD
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8080;
=======
const PORT = 8080;
>>>>>>> master/master

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
<<<<<<< HEAD
let useMongo = true;
let productManager, cartManager;

async function startServer() {
  try {
    // Intentar conectar a MongoDB
    try {
      await connectMongo();
    } catch (mongoErr) {
      console.warn('MongoDB no disponible, usando almacenamiento en archivos:', mongoErr.message);
      useMongo = false;
    }

    // Crear managers según el modo
    productManager = new ProductManager(useMongo ? undefined : path.join(__dirname, '../data/products.json'));
    cartManager = new CartManager(useMongo ? undefined : path.join(__dirname, '../data/carts.json'));

    // Seed productos de ejemplo si la colección está vacía (solo en Mongo)
    if (useMongo) {
      const productCount = await ProductModel.countDocuments();
      if (productCount === 0) {
        console.log('Agregando productos de ejemplo...');
        const sampleProducts = [
          {
            title: 'iPhone 15 Pro',
            description: 'El último smartphone de Apple con chip A17 Bionic y cámara avanzada.',
            code: 'IPH15P',
            price: 1199,
            status: true,
            stock: 50,
            category: 'Electrónica',
            thumbnails: ['https://example.com/iphone15pro.jpg']
          },
          {
            title: 'MacBook Air M3',
            description: 'Laptop ultradelgada con chip M3 para máxima eficiencia.',
            code: 'MBAIR23',
            price: 1099,
            status: true,
            stock: 30,
            category: 'Computadoras',
            thumbnails: ['https://example.com/macbookair.jpg']
          },
          {
            title: 'Sony WH-1000XM5',
            description: 'Auriculares inalámbricos con cancelación de ruido superior.',
            code: 'SONYWH5',
            price: 399,
            status: true,
            stock: 75,
            category: 'Audio',
            thumbnails: ['https://example.com/sonywh1000xm5.jpg']
          },
          {
            title: 'Nike Air Max 270',
            description: 'Zapatillas deportivas con amortiguación Air Max.',
            code: 'NIKEAM270',
            price: 150,
            status: true,
            stock: 100,
            category: 'Ropa y Calzado',
            thumbnails: ['https://example.com/nikeairmax270.jpg']
          },
          {
            title: 'Samsung Galaxy S24',
            description: 'Smartphone Android con pantalla AMOLED y batería de larga duración.',
            code: 'SGS24',
            price: 899,
            status: true,
            stock: 60,
            category: 'Electrónica',
            thumbnails: ['https://example.com/galaxys24.jpg']
          }
        ];

        await ProductModel.insertMany(sampleProducts);
        console.log('Productos de ejemplo agregados exitosamente.');
      }
    }

=======
const productManager = new ProductManager();
const cartManager = new CartManager();

// Inicializar y arrancar el servidor
async function startServer() {
  try {
>>>>>>> master/master
    // Inicializar managers con los datos persistidos
    await productManager.initialize();
    await cartManager.initialize();

<<<<<<< HEAD
    // Seed productos de ejemplo si no hay productos (para ambos modos)
    const existingProducts = await productManager.getAllProducts();
    if (existingProducts.length === 0) {
      console.log('Agregando productos de ejemplo...');
      const sampleProducts = [
        {
          title: 'iPhone 15 Pro',
          description: 'El último smartphone de Apple con chip A17 Bionic y cámara avanzada.',
          code: 'IPH15P',
          price: 1199,
          status: true,
          stock: 50,
          category: 'Electrónica',
          thumbnails: ['https://example.com/iphone15pro.jpg']
        },
        {
          title: 'MacBook Air M3',
          description: 'Laptop ultradelgada con chip M3 para máxima eficiencia.',
          code: 'MBAIR23',
          price: 1099,
          status: true,
          stock: 30,
          category: 'Computadoras',
          thumbnails: ['https://example.com/macbookair.jpg']
        },
        {
          title: 'Sony WH-1000XM5',
          description: 'Auriculares inalámbricos con cancelación de ruido superior.',
          code: 'SONYWH5',
          price: 399,
          status: true,
          stock: 75,
          category: 'Audio',
          thumbnails: ['https://example.com/sonywh1000xm5.jpg']
        },
        {
          title: 'Nike Air Max 270',
          description: 'Zapatillas deportivas con amortiguación Air Max.',
          code: 'NIKEAM270',
          price: 150,
          status: true,
          stock: 100,
          category: 'Ropa y Calzado',
          thumbnails: ['https://example.com/nikeairmax270.jpg']
        },
        {
          title: 'Samsung Galaxy S24',
          description: 'Smartphone Android con pantalla AMOLED y batería de larga duración.',
          code: 'SGS24',
          price: 899,
          status: true,
          stock: 60,
          category: 'Electrónica',
          thumbnails: ['https://example.com/galaxys24.jpg']
        }
      ];

      for (const prod of sampleProducts) {
        await productManager.addProduct(prod);
      }
      console.log('Productos de ejemplo agregados exitosamente.');
    }

    // Crear routers (pasar io para emitir eventos en endpoints)
    const productsRouter = createProductsRouter(productManager, io);
    const cartsRouter = createCartsRouter(cartManager, productManager);
    const viewsRouter = createViewsRouter(productManager, cartManager);
=======
    // Crear routers (pasar io para emitir eventos en endpoints)
    const productsRouter = createProductsRouter(productManager, io);
    const cartsRouter = createCartsRouter(cartManager, productManager);
    const viewsRouter = createViewsRouter(productManager);
>>>>>>> master/master

    // Rutas
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    // vistas handlebars
    app.use('/', viewsRouter);

    // Ruta base para verificar que el servidor está funcionando
<<<<<<< HEAD
    app.get('/', async (req, res) => {
      const limit = parseInt(req.query.limit, 10) || 5;
      const page = parseInt(req.query.page, 10) || 1;
      const sort = req.query.sort === 'asc' || req.query.sort === 'desc' ? req.query.sort : undefined;
      const query = typeof req.query.query === 'string' && req.query.query.trim() !== '' ? req.query.query.trim() : undefined;

      const { payload: products, totalPages, page: currentPage, hasPrevPage, hasNextPage } = await productManager.getProducts({ limit, page, sort, query });

      const buildLink = (targetPage) => {
        const params = new URLSearchParams({ ...req.query, page: targetPage });
        return `${req.protocol}://${req.get('host')}${req.baseUrl}/?${params.toString()}`;
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
=======
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Servidor de E-commerce activo',
        endpoints: {
          products: '/api/products',
          carts: '/api/carts'
>>>>>>> master/master
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

<<<<<<< HEAD
    const startListening = (port) => new Promise((resolve, reject) => {
      const onError = (err) => {
        server.removeListener('listening', onListening);
        reject(err);
      };
      const onListening = () => {
        server.removeListener('error', onError);
        resolve(port);
      };

      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(port);
    });

    let port = DEFAULT_PORT;
    let boundPort;
    const maxAttempts = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        boundPort = await startListening(port);
        break;
      } catch (err) {
        if (err.code === 'EADDRINUSE') {
          console.warn(`Puerto ${port} en uso, intentando puerto ${port + 1}...`);
          port += 1;
          continue;
        }
        throw err;
      }
    }

    if (!boundPort) {
      throw new Error(`No se pudo iniciar el servidor en ningún puerto entre ${DEFAULT_PORT} y ${DEFAULT_PORT + maxAttempts - 1}`);
    }

    console.log(`Servidor escuchando en puerto ${boundPort}`);
    console.log(`http://localhost:${boundPort}`);
=======
    server.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
>>>>>>> master/master
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
