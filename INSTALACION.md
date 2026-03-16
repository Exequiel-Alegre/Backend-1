# Instrucciones de Instalación y Ejecución

## Requisitos Previos

Antes de ejecutar el proyecto, debes instalar **Node.js** en tu computadora.

### Instalar Node.js

1. Ve a [nodejs.org](https://nodejs.org/)
2. Descarga la versión LTS (Long Term Support)
3. Ejecuta el instalador y sigue las instrucciones
4. Después de instalar, verifica que Node.js está correctamente instalado abriendo PowerShell o CMD y ejecutando:
   ```bash
   node --version
   npm --version
   ```

## Instalación del Proyecto

Una vez que Node.js está instalado:

1. Abre PowerShell o CMD
2. Navega a la carpeta del proyecto:
   ```bash
   cd "C:\Users\exequ\OneDrive\Desktop\REACT"
   ```

3. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

## Ejecutar el Servidor

Después de instalar las dependencias, ejecuta el servidor con uno de estos comandos:

### Modo Producción
```bash
npm start
```

### Modo Desarrollo (con auto-reinicio al cambiar archivos)
```bash
npm run dev
```

El servidor estará disponible en: **http://localhost:8080**

## Probar los Endpoints

Puedes usar:
- **Postman** (https://www.postman.com/downloads/)
- **Thunder Client** (extensión de VS Code)
- **curl** desde PowerShell o CMD
- **REST Client** (extensión de VS Code)

## Estructura del Proyecto

```
REACT/
├── src/
│   ├── index.js              # Servidor principal
│   ├── managers/
│   │   ├── ProductManager.js # Gestor de productos
│   │   └── CartManager.js    # Gestor de carritos
│   └── routes/
│       ├── products.js       # Rutas de productos
│       └── carts.js          # Rutas de carritos
├── data/
│   ├── products.json         # Base de datos de productos
│   └── carts.json            # Base de datos de carritos
├── package.json              # Dependencias del proyecto
└── README.md                 # Documentación de endpoints
```

## Solución de Problemas

### Error: "npm: El término 'npm' no se reconoce"
- Node.js no está correctamente instalado o no está en el PATH de Windows
- Solución: Reinstala Node.js y asegúrate de marcar la opción "Add to PATH" durante la instalación
- Reinicia PowerShell/CMD después de instalar Node.js

### Puerto 8080 en uso
- Otro proceso está usando el puerto 8080
- Solución: Cambia el puerto en `src/index.js` en la línea `const PORT = 8080;`
