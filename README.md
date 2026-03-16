# API E-commerce

Servidor Node.js con Express para gestionar productos y carritos de compra.

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Inicia el servidor:
```bash
npm start
```

O en modo desarrollo (con auto-reinicio):
```bash
npm run dev
```

Para ejecutar los tests unitarios incorporados:
```bash
npm test
```

También puedes correr el linter para revisar estilo:
```bash
npm run lint
```

El servidor escuchará en `http://localhost:8080`

## Endpoints

### Productos (/api/products/)

#### GET /
Listar todos los productos
```bash
curl http://localhost:8080/api/products
```

#### GET /:pid
Obtener un producto por ID
```bash
curl http://localhost:8080/api/products/1
```

#### POST /
Crear un nuevo producto
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laptop",
    "description": "Laptop de alta gama",
    "code": "LAPTOP001",
    "price": 1500,
    "stock": 10,
    "status": true,
    "category": "Electrónica",
    "thumbnails": ["img/laptop.jpg"]
  }'
```

#### PUT /:pid
Actualizar un producto (el ID no se puede modificar)
```bash
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1400,
    "stock": 8
  }'
```

#### DELETE /:pid
Eliminar un producto
```bash
curl -X DELETE http://localhost:8080/api/products/1
```

### Carritos (/api/carts/)

#### POST /
Crear un nuevo carrito
```bash
curl -X POST http://localhost:8080/api/carts \
  -H "Content-Type: application/json"
```

#### GET /:cid
Listar productos de un carrito
```bash
curl http://localhost:8080/api/carts/1
```

#### POST /:cid/product/:pid
Agregar un producto al carrito (incrementa cantidad si ya existe)
```bash
curl -X POST http://localhost:8080/api/carts/1/product/1 \
  -H "Content-Type: application/json"
```

## Estructura de Datos

### Producto
```json
{
  "id": 1,
  "title": "Producto",
  "description": "Descripción del producto",
  "code": "PROD001",
  "price": 100,
  "stock": 50,
  "status": true,
  "category": "Categoría",
  "thumbnails": ["img/prod.jpg"]
}
```

### Carrito
```json
{
  "id": 1,
  "products": [
    {
      "product": 1,
      "quantity": 2
    }
  ]
}

## Esquemas y Validaciones

Los cuerpos de request deben cumplir los siguientes contratos básicos (se realizan comprobaciones en el servidor):

### Producto
```json
{
  "title": "string (requerido)",
  "description": "string (requerido)",
  "code": "string único (requerido)",
  "price": "número >= 0 (requerido)",
  "stock": "entero >= 0 (requerido)",
  "status": "booleano (opcional, true por defecto)",
  "category": "string opcional",
  "thumbnails": "array de strings (opcional)"
}
```

### Carrito
```json
{
  "id": "número",
  "products": [
    { "product": "id del producto", "quantity": "entero" }
  ]
}
```

Los endpoints validan estos tipos y devuelven 400 en caso de violación.
```

## Persistencia

Los datos se guardan automáticamente en archivos JSON:
- `data/products.json` - Base de datos de productos
- `data/carts.json` - Base de datos de carritos

## Características Implementadas

✅ Gestión completa de productos (CRUD)
✅ Gestión de carritos
✅ Agregar productos a carrito con incremento de cantidad
✅ Persistencia en archivos JSON
✅ IDs auto-generados
✅ Validación de datos
✅ Manejo de errores
✅ Rutas con Express Router
