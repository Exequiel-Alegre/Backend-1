```
 ██████╗ ██████╗ ███╗   ███╗███╗   ███╗███████╗██████╗  ██████╗███████╗
██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔════╝██╔══██╗██╔════╝██╔════╝
██║     ██║   ██║██╔████╔██║██╔████╔██║█████╗  ██████╔╝██║     █████╗  
██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══╝  ██╔══██╗██║     ██╔══╝  
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║███████╗██║  ██║╚██████╗███████╗
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚══════╝

       API REST - Gestión de Productos y Carritos de Compra
                   Node.js + Express + JSON
```

# 🎉 ¡BIENVENIDO AL PROYECTO E-COMMERCE API!

## ⚡ COMIENZA EN 3 PASOS

### 1️⃣ Instala Node.js
→ Descarga desde [nodejs.org](https://nodejs.org)
→ Ejecuta el instalador
→ **Reinicia tu computadora**

### 2️⃣ Instala el Proyecto
```bash
cd "C:\Users\exequ\OneDrive\Desktop\REACT"
npm install
```

### 3️⃣ Inicia el Servidor
```bash
npm start
```

✅ **¡Listo!** Servidor en: `http://localhost:8080`

---

## 📚 DOCUMENTACIÓN PRINCIPAL

| Documento | Descripción |
|-----------|------------|
| **[START_HERE.md](START_HERE.md)** | 🎯 Guía rápida (léelo primero!) |
| **[README.md](README.md)** | 📖 Documentación completa de endpoints |
| **[EJEMPLOS_PRUEBA.md](EJEMPLOS_PRUEBA.md)** | 🧪 25+ ejemplos con curl |
| **[INSTALACION.md](INSTALACION.md)** | 📦 Instrucciones detalladas |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | 🔧 Solución de problemas |
| **[DETALLES_TECNICOS.md](DETALLES_TECNICOS.md)** | 🏗️ Cómo funciona internamente |
| **[INDEX.md](INDEX.md)** | 📑 Índice de toda la documentación |

---

## 🎯 PRUEBA RÁPIDA

```bash
# Terminal 1: Inicia el servidor
npm start

# Terminal 2: Crea un producto
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Monitor 4K",
    "description": "Monitor gaming",
    "code": "MON001",
    "price": 300,
    "stock": 10
  }'

# Ve todos los productos
curl http://localhost:8080/api/products

# Crea un carrito
curl -X POST http://localhost:8080/api/carts \
  -H "Content-Type: application/json"

# Agrega producto al carrito
curl -X POST http://localhost:8080/api/carts/1/product/1 \
  -H "Content-Type: application/json"

# Ve el carrito
curl http://localhost:8080/api/carts/1
```

---

## 📦 ¿QUÉ INCLUYE ESTE PROYECTO?

### ✅ Funcionalidades
- ✅ CRUD completo de productos
- ✅ Gestión de carritos
- ✅ Agregar productos al carrito (con incremento de cantidad)
- ✅ Persistencia en archivos JSON
- ✅ Validación de datos
- ✅ Manejo de errores

### ✅ Endpoints
```
GET    /api/products/          Listar productos
GET    /api/products/:pid      Obtener producto
POST   /api/products/          Crear producto
PUT    /api/products/:pid      Actualizar
DELETE /api/products/:pid      Eliminar

POST   /api/carts/             Crear carrito
GET    /api/carts/:cid         Ver carrito
POST   /api/carts/:cid/product/:pid  Agregar producto
```

---

## 🚀 ESTRUCTURA DEL PROYECTO

```
REACT/
├── 📚 DOCUMENTACIÓN (11 archivos)
│   ├── START_HERE.md           ← ⭐ LEE ESTO PRIMERO
│   ├── README.md
│   ├── INSTALACION.md
│   ├── EJEMPLOS_PRUEBA.md
│   ├── Y más...
│
├── 📦 src/ (Código Fuente)
│   ├── index.js                (Servidor)
│   ├── managers/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   └── routes/
│       ├── products.js
│       └── carts.js
│
├── 💾 data/ (Base de Datos)
│   ├── products.json
│   └── carts.json
│
└── ⚙️ package.json            (Dependencias)
```

---

## 🎓 PRÓXIMOS PASOS

1. **Lee [START_HERE.md](START_HERE.md)** (5 min)
2. **Instala Node.js** desde nodejs.org
3. **Ejecuta `npm install`**
4. **Ejecuta `npm start`**
5. **Prueba con [EJEMPLOS_PRUEBA.md](EJEMPLOS_PRUEBA.md)**
6. **¡Éxito!** 🎉

---

## ❓ ¿NECESITAS AYUDA?

### Problema
> "npm no se reconoce"

**Solución:** Lee [TROUBLESHOOTING.md](TROUBLESHOOTING.md#-npm-el-término-npm-no-se-reconoce)

### Problema
> "¿Cómo creo un producto?"

**Solución:** Mira [README.md](README.md) o [EJEMPLOS_PRUEBA.md](EJEMPLOS_PRUEBA.md)

### Problema
> "¿Cómo entiendo cómo funciona?"

**Solución:** Lee [DETALLES_TECNICOS.md](DETALLES_TECNICOS.md)

### Problema
> "¿Dónde veo todo?"

**Solución:** Revisa [INDEX.md](INDEX.md) para el índice completo

---

## 🎯 CHECKLIST DE INICIO

- [ ] Leí este archivo
- [ ] Leí START_HERE.md
- [ ] Instalé Node.js
- [ ] Ejecuté `npm install`
- [ ] El servidor inicia con `npm start`
- [ ] Creé mi primer producto
- [ ] Creé mi primer carrito
- [ ] Agregué un producto al carrito
- [ ] ✅ ¡LISTO!

---

## 📞 RESUMEN RÁPIDO

| Necesito... | Archivo |
|-----------|---------|
| Empezar | [START_HERE.md](START_HERE.md) |
| Instalar | [INSTALACION.md](INSTALACION.md) |
| Documentación | [README.md](README.md) |
| Ejemplos | [EJEMPLOS_PRUEBA.md](EJEMPLOS_PRUEBA.md) |
| Ayuda | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| Entender cómo funciona | [DETALLES_TECNICOS.md](DETALLES_TECNICOS.md) |
| Todo organizado | [INDEX.md](INDEX.md) |

---

## 💡 CONSEJOS

✅ Usa **Postman** para probar (más fácil que curl)
✅ Abre **dos terminales**: una para el servidor, otra para pruebas
✅ Revisa **data/products.json** para ver los datos guardados
✅ Cambia el puerto en **src/index.js** si 8080 está ocupado

---

## 🏆 ¡ÉXITO!

Todo está listo para usar. El proyecto incluye:
- ✅ Servidor completamente funcional
- ✅ Documentación exhaustiva (11 archivos)
- ✅ Ejemplos de prueba (25+)
- ✅ Guía de solución de problemas
- ✅ Código limpio y bien organizado

**¡Ahora sí, a programar! 🚀**

---

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👉 LEE: START_HERE.md                    ┃
┃  👉 EJECUTA: npm install && npm start     ┃
┃  👉 PRUEBA: curl http://localhost:8080   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

*Proyecto completado con ❤️*
*Node.js + Express + JSON*
*Listo para usar en Enero 2026*
