// ── 1. OBJETO LITERAL ───────────────────────────────────────────────────
const barraCorrugada = {
  nombre: "Barra corrugada",
  precio: 45.0,
  categoria: "acero",
  stock: 40,
  disponible: true,
};

console.log(barraCorrugada.nombre);

const propiedad = "precio";
console.log(barraCorrugada[propiedad]);

barraCorrugada.stock = 35;
barraCorrugada.extra = false;
delete barraCorrugada.extra;

// ── 2. DESTRUCTURING ────────────────────────────────────────────────────
const { nombre, precio } = barraCorrugada;
console.log(`${nombre} cuesta Bs ${precio}`);

const barraOferta = { ...barraCorrugada, precio: 40.0, nombre: "Barra corrugada oferta" };
console.log(barraOferta);

// ── 3. ARREGLO DE OBJETOS ───────────────────────────────────────────────
const productos = [
  // Productos originales
  { 
    id: 1, 
    nombre: "Barra corrugada",   
    precio: 45.0,  
    categoria: "acero",     
    stock: 40, 
    disponible: true,
    img: "corrugada.jpg",
    descripcion: "Medidas de 6, 9 y 12 metros."
  },
  { 
    id: 2, 
    nombre: "Barra angular",  
    precio: 38.0,  
    categoria: "acero",     
    stock: 25, 
    disponible: true,
    img: "angular.jpg",
    descripcion: "Medidas de 6, 9 y 12 metros."
  },
  { 
    id: 3, 
    nombre: "Cemento VIACHA Plus",  
    precio: 52.0, 
    categoria: "cemento",     
    stock: 8,  
    disponible: true,
    img: "viacha.jpg",
    descripcion: "Fraguado rápido, resistente al frío."
  },
  { 
    id: 4, 
    nombre: "Cemento SOBOCE",      
    precio: 48.0,  
    categoria: "cemento",   
    stock: 30, 
    disponible: true,
    img: "soboce.jpg",
    descripcion: "-30% huella de carbono."
  },

  // ── 8 productos nuevos ────────────────────────────────────────────────
  {
    id: 5,
    nombre: "Alambre de amarre",
    precio: 28.0,
    categoria: "acero",
    stock: 50,
    disponible: true,
    img: "alambre.jpg",
    descripcion: "Rollo de 25 kg."
  },
  {
    id: 6,
    nombre: "Clavos de 3 pulgadas",
    precio: 35.0,
    categoria: "acero",
    stock: 40,
    disponible: true,
    img: "clavos.jpg",
    descripcion: "Caja de 25 kg."
  },
  {
    id: 7,
    nombre: "Arena fina",
    precio: 18.0,
    categoria: "agregados",
    stock: 100,
    disponible: true,
    img: "arena.jpg",
    descripcion: "Metro cúbico."
  },
  {
    id: 8,
    nombre: "Grava",
    precio: 22.0,
    categoria: "agregados",
    stock: 80,
    disponible: true,
    img: "grava.jpg",
    descripcion: "Metro cúbico."
  },
  {
    id: 9,
    nombre: "Ladrillo 6 huecos",
    precio: 1.80,
    categoria: "mamposteria",
    stock: 500,
    disponible: true,
    img: "ladrillo.jpg",
    descripcion: "Unidad."
  },
  {
    id: 10,
    nombre: "Bloque de hormigón",
    precio: 4.50,
    categoria: "mamposteria",
    stock: 300,
    disponible: true,
    img: "bloque.jpg",
    descripcion: "15x20x40 cm."
  },
  {
    id: 11,
    nombre: "Varilla lisa 6mm",
    precio: 32.0,
    categoria: "acero",
    stock: 60,
    disponible: true,
    img: "varilla-lisa.jpg",
    descripcion: "Barra de 12 metros."
  },
  {
    id: 12,
    nombre: "Cemento blanco",
    precio: 95.0,
    categoria: "cemento",
    stock: 15,
    disponible: true,
    img: "cemento-blanco.jpg",
    descripcion: "Bolsa de 25 kg."
  }
];

// ── 4. LOS MÉTODOS QUE IMPORTAN ─────────────────────────────────────────
productos.forEach(p => console.log(p.nombre));

const nombres = productos.map(p => p.nombre);
console.log(nombres);

const disponibles = productos.filter(p => p.disponible);
console.log(disponibles.length, "de", productos.length, "disponibles");

const caro = productos.find(p => p.precio > 50);
console.log(caro);

console.log(nombres.includes("Cemento SOBOCE"));
console.log(productos.some(p => p.stock === 0));
console.log(productos.every(p => p.precio > 0));

const porPrecio = [...productos].sort((a, b) => a.precio - b.precio);
console.log(porPrecio.map(p => p.nombre));

const valorInventario = productos.reduce((acumulador, p) => acumulador + p.precio * p.stock, 0);
console.log("Valor del inventario: Bs", valorInventario.toFixed(2));

// ── 5. ENCADENAR ────────────────────────────────────────────────────────
const nombresDisponibles = productos
  .filter(p => p.disponible)
  .map(p => p.nombre);
console.log(nombresDisponibles);

const totalCementoEnStock = productos
  .filter(p => p.categoria === "cemento" && p.disponible)
  .reduce((total, p) => total + p.precio * p.stock, 0);
console.log("Cemento en stock: Bs", totalCementoEnStock.toFixed(2));

const porCategoria = productos.reduce((grupos, p) => {
  if (!grupos[p.categoria]) grupos[p.categoria] = [];
  grupos[p.categoria].push(p.nombre);
  return grupos;
}, {});
console.log(porCategoria);

// ── 6. CLASES ───────────────────────────────────────────────────────────
class Producto {
  constructor(nombre, precio, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  estaDisponible() {
    return this.stock > 0;
  }

  valorEnStock() {
    return this.precio * this.stock;
  }
}

const cementoViacha = new Producto("Cemento VIACHA Plus", 52.0, 8);
console.log(cementoViacha.nombre, cementoViacha.estaDisponible(), cementoViacha.valorEnStock());

class ProductoConDescuento extends Producto {
  constructor(nombre, precio, stock, descuento) {
    super(nombre, precio, stock);
    this.descuento = descuento;
  }

  precioFinal() {
    return this.precio * (1 - this.descuento / 100);
  }
}

const barraDescuento = new ProductoConDescuento("Barra angular", 38.0, 25, 10);
console.log(barraDescuento.precioFinal(), barraDescuento.estaDisponible());