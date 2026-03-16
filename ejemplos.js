// Este archivo contiene ejemplos de código para probar la API
// Puede ejecutarse desde Node.js o desde el navegador (con algunas modificaciones)

const BASE_URL = 'http://localhost:8080/api';

// ============================================
// FUNCIONES PARA PRODUCTOS
// ============================================

async function crearProducto(productData) {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    const data = await response.json();
    console.log('Producto creado:', data);
    return data;
  } catch (error) {
    console.error('Error al crear producto:', error);
  }
}

async function obtenerProductos() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const data = await response.json();
    console.log('Productos:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
}

async function obtenerProductoPorId(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Producto no encontrado');
    }
    
    const data = await response.json();
    console.log('Producto:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener producto:', error);
  }
}

async function actualizarProducto(id, updateData) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    const data = await response.json();
    console.log('Producto actualizado:', data);
    return data;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
  }
}

async function eliminarProducto(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    console.log('Producto eliminado:', data);
    return data;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
  }
}

// ============================================
// FUNCIONES PARA CARRITOS
// ============================================

async function crearCarrito() {
  try {
    const response = await fetch(`${BASE_URL}/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    console.log('Carrito creado:', data);
    return data;
  } catch (error) {
    console.error('Error al crear carrito:', error);
  }
}

async function obtenerCarrito(cartId) {
  try {
    const response = await fetch(`${BASE_URL}/carts/${cartId}`);
    
    if (!response.ok) {
      throw new Error('Carrito no encontrado');
    }
    
    const data = await response.json();
    console.log('Carrito:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener carrito:', error);
  }
}

async function agregarProductoAlCarrito(cartId, productId) {
  try {
    const response = await fetch(`${BASE_URL}/carts/${cartId}/product/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    console.log('Producto agregado al carrito:', data);
    return data;
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
  }
}

// ============================================
// EJEMPLO DE USO COMPLETO
// ============================================

async function flujoCompleto() {
  console.log('=== INICIANDO PRUEBAS ===\n');

  // 1. Crear productos
  console.log('1. Creando productos...');
  const prod1 = await crearProducto({
    title: 'Monitor LED 24"',
    description: 'Monitor Full HD de 24 pulgadas',
    code: 'MON001',
    price: 250,
    stock: 15,
    status: true,
    category: 'Electrónica',
    thumbnails: ['img/monitor1.jpg', 'img/monitor2.jpg']
  });

  const prod2 = await crearProducto({
    title: 'Teclado USB',
    description: 'Teclado mecánico retroiluminado',
    code: 'KEY001',
    price: 120,
    stock: 25,
    status: true,
    category: 'Accesorios',
    thumbnails: ['img/keyboard.jpg']
  });

  // 2. Obtener todos los productos
  console.log('\n2. Obteniendo todos los productos...');
  await obtenerProductos();

  // 3. Obtener un producto específico
  console.log('\n3. Obteniendo producto con ID 1...');
  await obtenerProductoPorId(1);

  // 4. Actualizar un producto
  console.log('\n4. Actualizando producto con ID 1...');
  await actualizarProducto(1, { price: 230, stock: 12 });

  // 5. Crear un carrito
  console.log('\n5. Creando carrito...');
  const cart1 = await crearCarrito();

  // 6. Agregar productos al carrito
  console.log('\n6. Agregando productos al carrito...');
  await agregarProductoAlCarrito(cart1.id, prod1.id);
  await agregarProductoAlCarrito(cart1.id, prod2.id);

  // 7. Agregar el mismo producto nuevamente
  console.log('\n7. Agregando producto 1 nuevamente (incrementa cantidad)...');
  await agregarProductoAlCarrito(cart1.id, prod1.id);

  // 8. Ver contenido del carrito
  console.log('\n8. Viendo contenido del carrito...');
  await obtenerCarrito(cart1.id);

  // 9. Ejemplo de manejo de errores: intentar crear producto sin campos obligatorios
  console.log('\n9. Intentar producto inválido...');
  await crearProducto({ title: 'invalido' });

  // 10. Intentar agregar producto sin stock
  console.log('\n10. Reduciendo stock a 0 y probando error al agregar...');
  await actualizarProducto(prod1.id, { stock: 0 });
  await agregarProductoAlCarrito(cart1.id, prod1.id);

  // 9. Eliminar un producto
  console.log('\n9. Eliminando producto 2...');
  await eliminarProducto(prod2.id);

  // 10. Verificar productos después de eliminar
  console.log('\n10. Productos finales...');
  await obtenerProductos();

  console.log('\n=== PRUEBAS COMPLETADAS ===');
}

// Para ejecutar en Node.js con ES modules, descomenta la siguiente línea:
// flujoCompleto();

// Exportar para uso como módulo
export {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  crearCarrito,
  obtenerCarrito,
  agregarProductoAlCarrito,
  flujoCompleto
};
