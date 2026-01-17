# Ejemplos de Pruebas con curl

## Iniciar el servidor
```bash
npm start
```

El servidor estará disponible en `http://localhost:8080`

---

## PRODUCTOS

### 1. Crear un producto
```bash
curl -X POST http://localhost:8080/api/products `
  -H "Content-Type: application/json" `
  -d '{
    "title": "Laptop Gaming",
    "description": "Laptop de alto rendimiento para juegos",
    "code": "LAPTOP001",
    "price": 1500,
    "stock": 5,
    "status": true,
    "category": "Electrónica",
    "thumbnails": ["img/laptop1.jpg", "img/laptop2.jpg"]
  }'
```

### 2. Crear otro producto
```bash
curl -X POST http://localhost:8080/api/products `
  -H "Content-Type: application/json" `
  -d '{
    "title": "Mouse Inalámbrico",
    "description": "Mouse gaming inalámbrico con batería",
    "code": "MOUSE001",
    "price": 45,
    "stock": 20,
    "status": true,
    "category": "Accesorios",
    "thumbnails": ["img/mouse.jpg"]
  }'
```

### 3. Obtener todos los productos
```bash
curl http://localhost:8080/api/products
```

### 4. Obtener un producto por ID
```bash
curl http://localhost:8080/api/products/1
```

### 5. Actualizar un producto
```bash
curl -X PUT http://localhost:8080/api/products/1 `
  -H "Content-Type: application/json" `
  -d '{
    "price": 1400,
    "stock": 3
  }'
```

### 6. Eliminar un producto
```bash
curl -X DELETE http://localhost:8080/api/products/1
```

---

## CARRITOS

### 1. Crear un carrito
```bash
curl -X POST http://localhost:8080/api/carts `
  -H "Content-Type: application/json"
```

### 2. Crear otro carrito
```bash
curl -X POST http://localhost:8080/api/carts `
  -H "Content-Type: application/json"
```

### 3. Ver productos en un carrito
```bash
curl http://localhost:8080/api/carts/1
```

### 4. Agregar un producto al carrito
```bash
curl -X POST http://localhost:8080/api/carts/1/product/1 `
  -H "Content-Type: application/json"
```

### 5. Agregar el mismo producto nuevamente (incrementa cantidad)
```bash
curl -X POST http://localhost:8080/api/carts/1/product/1 `
  -H "Content-Type: application/json"
```

### 6. Agregar otro producto al carrito
```bash
curl -X POST http://localhost:8080/api/carts/1/product/2 `
  -H "Content-Type: application/json"
```

---

## FLUJO COMPLETO DE PRUEBA

```powershell
# 1. Crear primer producto
curl -X POST http://localhost:8080/api/products -H "Content-Type: application/json" -d '{"title":"Monitor","description":"Monitor 4K","code":"MON001","price":300,"stock":10,"status":true,"category":"Electrónica"}'

# 2. Crear segundo producto
curl -X POST http://localhost:8080/api/products -H "Content-Type: application/json" -d '{"title":"Teclado Mecánico","description":"Teclado gaming mecánico","code":"KEY001","price":150,"stock":15,"status":true,"category":"Accesorios"}'

# 3. Ver todos los productos
curl http://localhost:8080/api/products

# 4. Crear un carrito
curl -X POST http://localhost:8080/api/carts -H "Content-Type: application/json"

# 5. Agregar producto 1 al carrito 1
curl -X POST http://localhost:8080/api/carts/1/product/1 -H "Content-Type: application/json"

# 6. Agregar producto 2 al carrito 1
curl -X POST http://localhost:8080/api/carts/1/product/2 -H "Content-Type: application/json"

# 7. Agregar producto 1 nuevamente (incrementa cantidad)
curl -X POST http://localhost:8080/api/carts/1/product/1 -H "Content-Type: application/json"

# 8. Ver carrito
curl http://localhost:8080/api/carts/1

# 9. Actualizar precio del producto 1
curl -X PUT http://localhost:8080/api/products/1 -H "Content-Type: application/json" -d '{"price":280}'

# 10. Eliminar producto
curl -X DELETE http://localhost:8080/api/products/2
```

---

## Usar en Postman

1. Abre Postman
2. Crea una nueva colección llamada "E-commerce API"
3. Agrega las siguientes requests:

### Products
- **POST** `http://localhost:8080/api/products` - Crear producto
- **GET** `http://localhost:8080/api/products` - Listar productos
- **GET** `http://localhost:8080/api/products/:pid` - Obtener producto
- **PUT** `http://localhost:8080/api/products/:pid` - Actualizar producto
- **DELETE** `http://localhost:8080/api/products/:pid` - Eliminar producto

### Carts
- **POST** `http://localhost:8080/api/carts` - Crear carrito
- **GET** `http://localhost:8080/api/carts/:cid` - Ver carrito
- **POST** `http://localhost:8080/api/carts/:cid/product/:pid` - Agregar producto
