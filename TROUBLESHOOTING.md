# 🔧 GUÍA DE SOLUCIÓN DE PROBLEMAS

## ❌ "npm: El término 'npm' no se reconoce"

**Causa:** Node.js no está instalado o no está en la variable PATH

**Solución:**
1. Descarga Node.js desde https://nodejs.org (versión LTS)
2. Ejecuta el instalador
3. **MUY IMPORTANTE:** En la pantalla de instalación, marca la opción "Add to PATH"
4. Completa la instalación
5. **Reinicia completamente tu computadora**
6. Abre una nueva ventana de PowerShell o CMD
7. Verifica que funcione:
   ```bash
   node --version
   npm --version
   ```

---

## ❌ "Puerto 8080 ya está en uso"

**Causa:** Otro proceso está usando el puerto 8080

**Solución 1: Cambiar el puerto**
1. Abre `src/index.js`
2. Busca la línea: `const PORT = 8080;`
3. Cambia 8080 por otro número (ej: 3000, 5000, 9000)
4. Guarda el archivo
5. Reinicia el servidor

**Solución 2: Liberar el puerto**
```bash
# Encuentra qué proceso está usando el puerto 8080
netstat -ano | findstr :8080

# Verás algo como: TCP ... :8080 ... LISTENING 12345
# El 12345 es el PID del proceso

# Termina el proceso (reemplaza 12345 con el PID)
taskkill /PID 12345 /F
```

---

## ❌ "Cannot find module 'express'"

**Causa:** Las dependencias no están instaladas

**Solución:**
```bash
# Asegúrate de estar en la carpeta correcta
cd "C:\Users\exequ\OneDrive\Desktop\REACT"

# Instala las dependencias
npm install

# Verifica que se creó la carpeta node_modules
dir node_modules
```

---

## ❌ "Error: Cannot find module 'ProductManager'"

**Causa:** El archivo ProductManager.js está en la ruta incorrecta

**Verifica:**
```
src/
  └── managers/
      ├── ProductManager.js  ← Debe existir aquí
      └── CartManager.js     ← Debe existir aquí
```

**Solución:**
1. Asegúrate que los archivos existan en las rutas correctas
2. Usa comandos como:
   ```bash
   Test-Path "src/managers/ProductManager.js"
   ```

---

## ❌ "El servidor se detiene inmediatamente después de iniciar"

**Causa:** Hay un error en el código

**Solución:**
1. Abre PowerShell en la carpeta del proyecto
2. Ejecuta:
   ```bash
   npm start
   ```
3. Lee el mensaje de error que aparece
4. Busca la solución en esta guía o en DETALLES_TECNICOS.md

**Errores comunes:**
- "SyntaxError" = Error de sintaxis en el código
- "Cannot read property" = Variable no inicializada
- "Module not found" = Archivo faltante

---

## ❌ "Los datos no se guardan después de crear productos"

**Causa:** Los archivos JSON no se están creando

**Verifica:**
1. ¿Existe la carpeta `data/`?
   ```bash
   Test-Path "data"
   ```

2. ¿Existen los archivos?
   ```bash
   Test-Path "data/products.json"
   Test-Path "data/carts.json"
   ```

**Solución:**
1. Crea manualmente la carpeta:
   ```bash
   New-Item -ItemType Directory -Path "data" -Force
   ```

2. Crea los archivos vacíos:
   ```bash
   New-Item -Path "data/products.json" -ItemType File -Force
   New-Item -Path "data/carts.json" -ItemType File -Force
   ```

3. Llena los archivos con arrays vacíos:
   - `data/products.json`: `[]`
   - `data/carts.json`: `[]`

---

## ❌ "Error al agregar producto al carrito: 404"

**Causa:** El producto o carrito no existe

**Solución:**
1. Verifica que creaste primero los productos:
   ```bash
   curl http://localhost:8080/api/products
   ```

2. Verifica que creaste el carrito:
   ```bash
   curl http://localhost:8080/api/carts/1
   ```

3. Usa IDs correctos al agregar:
   ```bash
   # Reemplaza los números con los IDs reales
   curl -X POST http://localhost:8080/api/carts/1/product/1 \
     -H "Content-Type: application/json"
   ```

---

## ❌ "Error: ENOENT: no such file or directory"

**Causa:** El proyecto no puede acceder a los archivos

**Solución:**
1. Verifica que estés en la carpeta correcta:
   ```bash
   Get-Location
   # Debe mostrar: C:\Users\exequ\OneDrive\Desktop\REACT
   ```

2. Verifica que todos los archivos existen:
   ```bash
   Get-ChildItem -Recurse
   ```

3. Verifica los permisos:
   - Asegúrate de que tienes permiso de lectura/escritura
   - Si está en OneDrive, verifica que está sincronizado

---

## ❌ "curl: error al parsear JSON"

**Causa:** El JSON no está bien formado

**Solución:**
En PowerShell, usa backticks (`) para saltos de línea:

```bash
# CORRECTO
curl -X POST http://localhost:8080/api/products `
  -H "Content-Type: application/json" `
  -d '{"title":"Test","description":"Test","code":"T","price":100,"stock":10}'

# INCORRECTO (sin backticks)
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"...}'
```

---

## ❌ "El servidor se reinicia automáticamente"

**Si ejecutaste `npm run dev`**
- El servidor se reinicia automáticamente al cambiar archivos
- Esto es normal y esperado
- Para evitarlo, usa `npm start` en su lugar

---

## ❌ "Postman no puede conectarse"

**Causa:** El servidor no está escuchando

**Solución:**
1. Verifica que el servidor está corriendo:
   ```bash
   npm start
   # Debe mostrar: "Servidor escuchando en puerto 8080"
   ```

2. Verifica que usas la URL correcta en Postman:
   - `http://localhost:8080/api/products` (no https)

3. Prueba con curl primero:
   ```bash
   curl http://localhost:8080
   ```

---

## ✅ PRUEBA RÁPIDA PARA VERIFICAR TODO

Ejecuta esto paso a paso:

```bash
# 1. Verifica Node.js
node --version

# 2. Verifica npm
npm --version

# 3. Ve a la carpeta correcta
cd "C:\Users\exequ\OneDrive\Desktop\REACT"

# 4. Instala dependencias
npm install

# 5. Inicia el servidor
npm start

# EN OTRA VENTANA DE POWERSHELL:
# 6. Prueba que el servidor responde
curl http://localhost:8080

# 7. Crea un producto
curl -X POST http://localhost:8080/api/products `
  -H "Content-Type: application/json" `
  -d '{"title":"Test","description":"Test","code":"T1","price":100,"stock":5}'

# 8. Ver productos
curl http://localhost:8080/api/products
```

Si todo funciona, ¡tu API está lista! ✅

---

## 📞 ERRORES NO LISTADOS

**Si encuentras un error que no está aquí:**

1. Lee el mensaje de error completo
2. Busca la palabra clave en:
   - DETALLES_TECNICOS.md
   - README.md
   - El código fuente en `src/`

3. Verifica que todos los archivos existan:
   ```bash
   Get-ChildItem -Path src -Recurse -Name
   ```

---

## 🎯 VERIFICACIÓN FINAL

Antes de contactar soporte, verifica:

- [ ] Node.js está instalado (`node --version`)
- [ ] npm está disponible (`npm --version`)
- [ ] Ejecutaste `npm install`
- [ ] El servidor inicia sin errores (`npm start`)
- [ ] Puedes acceder a `http://localhost:8080` en el navegador
- [ ] Los archivos en `src/` existen
- [ ] La carpeta `data/` existe
- [ ] El archivo `package.json` está en la raíz

Si todo esto está OK y aún hay problemas, verifica los mensajes de error en la consola.

---

**¡Esperamos que esto resuelva tu problema! 😊**
