# GUÍA RÁPIDA - START HERE 🚀

## ¿Qué es este proyecto?

Un servidor REST API para gestionar una tienda en línea con:
- ✅ Gestión de **Productos** (crear, leer, actualizar, eliminar)
- ✅ Gestión de **Carritos de compra** (crear, agregar productos)
- ✅ Almacenamiento en **archivos JSON**

## Instalación (2 pasos)

### Paso 1: Instalar Node.js
1. Ve a https://nodejs.org
2. Descarga la versión **LTS** (recomendada)
3. Ejecuta el instalador y sigue las instrucciones
4. **Reinicia tu computadora**

### Paso 2: Instalar el proyecto
Abre PowerShell o CMD en esta carpeta y ejecuta:
```bash
npm install
```

## Ejecutar el servidor

```bash
npm start
```

**✅ Listo!** El servidor está en: `http://localhost:8080`

## Probar la API

### Opción A: Postman (más fácil)
1. Descarga Postman desde https://www.postman.com
2. Abre el archivo `EJEMPLOS_PRUEBA.md`
3. Copia y pega los ejemplos

### Opción B: Prueba rápida (PowerShell)
```powershell
# Crear un producto
curl -X POST http://localhost:8080/api/products `
  -H "Content-Type: application/json" `
  -d '{
    "title": "Laptop",
    "description": "Laptop gaming",
    "code": "LAPTOP001",
    "price": 1200,
    "stock": 5
  }'

# Ver todos los productos
curl http://localhost:8080/api/products
```

## Archivos importantes

| Archivo | Propósito |
|---------|-----------|
| 📄 **README.md** | Documentación completa de endpoints |
| 📄 **EJEMPLOS_PRUEBA.md** | 25+ ejemplos de prueba con curl |
| 📄 **INSTALACION.md** | Instrucciones detalladas de instalación |
| 📄 **DETALLES_TECNICOS.md** | Cómo funciona internamente |
| 📄 **CHECKLIST.md** | Verificación de requisitos completados |

## Estructura básica

```
Productos (CRUD)     →  data/products.json
     ↑
     API (Express)
     ↓
Carritos (Create + Add)  →  data/carts.json
```

## Endpoints principales

### Productos
- `GET /api/products` - Ver todos
- `POST /api/products` - Crear
- `GET /api/products/1` - Ver uno
- `PUT /api/products/1` - Actualizar
- `DELETE /api/products/1` - Eliminar

### Carritos
- `POST /api/carts` - Crear carrito
- `GET /api/carts/1` - Ver contenido
- `POST /api/carts/1/product/2` - Agregar producto

## Ejemplo completo

```bash
# 1. Crear producto 1
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Monitor","description":"Monitor 4K","code":"MON","price":300,"stock":10}'

# 2. Crear producto 2
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Teclado","description":"Teclado mecánico","code":"KEY","price":150,"stock":20}'

# 3. Crear carrito
curl -X POST http://localhost:8080/api/carts \
  -H "Content-Type: application/json"

# 4. Agregar producto 1 al carrito
curl -X POST http://localhost:8080/api/carts/1/product/1 \
  -H "Content-Type: application/json"

# 5. Agregar producto 2 al carrito
curl -X POST http://localhost:8080/api/carts/1/product/2 \
  -H "Content-Type: application/json"

# 6. Ver carrito
curl http://localhost:8080/api/carts/1
```

## Solución rápida de problemas

### Error: "npm no se reconoce"
→ Node.js no está instalado o no está en el PATH
→ Reinstala Node.js y reinicia

### Error: "Puerto 8080 en uso"
→ Otro proceso usa el puerto
→ Cambia el puerto en `src/index.js` línea 8

### Error: "Cannot find module 'express'"
→ No instalaste dependencias
→ Ejecuta: `npm install`

## Modo desarrollo (auto-reinicio)

```bash
npm run dev
```

Cuando hagas cambios en los archivos, el servidor se reinicia automáticamente.

## ¿Qué sigue?

1. ✅ Instala Node.js
2. ✅ Ejecuta `npm install`
3. ✅ Ejecuta `npm start`
4. ✅ Prueba con los ejemplos en `EJEMPLOS_PRUEBA.md`
5. ✅ Lee `README.md` para más detalles

---

**¡Listo para comenzar!** 🎉
