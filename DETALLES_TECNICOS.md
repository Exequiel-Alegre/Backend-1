# Detalles Técnicos del Proyecto

## Resumen de Implementación

Este proyecto es una **API RESTful** desarrollada con **Node.js** y **Express** que proporciona servicios de gestión de productos y carritos de compra.

## Arquitectura

```
API REST (Express)
    │
    ├── ProductManager (Gestión de productos)
    │   └── data/products.json (Persistencia)
    │
    └── CartManager (Gestión de carritos)
        └── data/carts.json (Persistencia)
```

## Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web minimalista para Node.js
- **Sistema de Archivos**: Persistencia en archivos JSON

## Estructura de Carpetas

```
REACT/
├── src/
│   ├── index.js                    # Punto de entrada del servidor
│   ├── managers/
│   │   ├── ProductManager.js       # Gestor de productos (CRUD)
│   │   └── CartManager.js          # Gestor de carritos
│   └── routes/
│       ├── products.js             # Router de productos
│       └── carts.js                # Router de carritos
│
├── data/
│   ├── products.json               # BD de productos
│   └── carts.json                  # BD de carritos
│
├── package.json                     # Dependencias del proyecto
├── README.md                        # Documentación de endpoints
├── INSTALACION.md                   # Instrucciones de instalación
├── EJEMPLOS_PRUEBA.md              # Ejemplos de uso con curl
├── ejemplos.js                      # Ejemplos con fetch API
└── .gitignore                       # Archivos a ignorar en git
```

## Flujo de Datos

### Crear un Producto
```
Cliente (POST /api/products)
    ↓
Express Router (routes/products.js)
    ↓
ProductManager.addProduct()
    ↓
Guardar en data/products.json
    ↓
Respuesta JSON al cliente
```

### Agregar Producto al Carrito
```
Cliente (POST /api/carts/:cid/product/:pid)
    ↓
Express Router (routes/carts.js)
    ↓
Validar carrito existe → CartManager.getCartById()
    ↓
Validar producto existe → ProductManager.getProductById()
    ↓
CartManager.addProductToCart()
    ↓
Actualizar quantity o agregar nuevo producto
    ↓
Guardar en data/carts.json
    ↓
Respuesta JSON al cliente
```

## Características Implementadas

### ProductManager
- ✅ Lectura de archivo JSON al inicializar
- ✅ Auto-generación de IDs únicos
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Validación de campos requeridos
- ✅ Persistencia automática en archivo JSON
- ✅ Prevención de modificación de ID al actualizar

### CartManager
- ✅ Creación de carritos con ID único
- ✅ Almacenamiento de productos con cantidad
- ✅ Incremento automático de cantidad si el producto ya existe
- ✅ Persistencia automática en archivo JSON

### Express Server
- ✅ Router modular para productos y carritos
- ✅ Validación de entrada (body parameters)
- ✅ Manejo de errores
- ✅ Respuestas JSON consistentes
- ✅ Códigos HTTP apropiados (201, 400, 404, 500)
- ✅ Middleware de parseo JSON

## Códigos HTTP Utilizados

- **200 OK**: Solicitud exitosa (GET, PUT, DELETE)
- **201 Created**: Recurso creado exitosamente (POST)
- **400 Bad Request**: Datos inválidos o incompletos
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor

## Formato de Respuestas

### Éxito
```json
{
  "id": 1,
  "title": "Producto",
  "description": "Descripción",
  "code": "PROD001",
  "price": 100,
  "stock": 50,
  "status": true,
  "category": "Categoría",
  "thumbnails": ["img/prod.jpg"]
}
```

### Error
```json
{
  "error": "Mensaje descriptivo del error"
}
```

## Requisitos de Validación

### Al crear un producto, se valida:
- ✅ `title` (requerido)
- ✅ `description` (requerido)
- ✅ `code` (requerido)
- ✅ `price` (requerido)
- ✅ `stock` (requerido)
- ⚙️ `status` (opcional, default: true)
- ⚙️ `category` (opcional)
- ⚙️ `thumbnails` (opcional, array)

### Restricciones
- El `id` se auto-genera automáticamente
- El `id` NO se puede modificar mediante PUT
- Los IDs son únicos y no se duplican
- La cantidad en el carrito se incrementa si el producto ya existe

## Inicialización de Datos

Al iniciar el servidor:
1. ProductManager carga `data/products.json`
2. CartManager carga `data/carts.json`
3. Se calculan los próximos IDs basados en los máximos existentes
4. Si los archivos no existen, se crean vacíos

## Desarrollo Futuro (No implementado)

- [ ] Base de datos (MongoDB, PostgreSQL)
- [ ] Autenticación y autorización
- [ ] Paginación en GET de productos
- [ ] Búsqueda y filtrado de productos
- [ ] Eliminación de productos del carrito
- [ ] Actualización de cantidad en carrito
- [ ] Descuentos y cupones
- [ ] Historial de pedidos
- [ ] Métodos de pago
- [ ] Validación de email y teléfono

## Testing

Para probar la API, consulta:
- `README.md` - Guía de endpoints
- `EJEMPLOS_PRUEBA.md` - Ejemplos con curl
- `ejemplos.js` - Ejemplos con JavaScript
- Usa Postman o Thunder Client para pruebas interactivas

## Variables de Entorno (Futuro)

Actualmente hardcodeado en `src/index.js`:
```javascript
const PORT = 8080;
```

En futuras versiones se puede usar `.env`:
```
PORT=8080
NODE_ENV=development
```
