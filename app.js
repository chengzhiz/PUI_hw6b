// Variables
const carrito = document.getElementById('carrito');
const oatdrinks = document.getElementById('lista-oatdrinks');
const listaoatdrinks = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');


// Listeners
cargarEventListeners();
function cargarEventListeners() {
  // Dispara cuando se presiona "Agregar Carrito"
  oatdrinks.addEventListener('click', compraroatdrink);
  // Cuando se elimina un oatdrink del carrito
  carrito.addEventListener('click', eliminaroatdrink);
  // Al Vaciar el carrito
  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
  // Al cargar el documento, mostrar LocalStorage
  document.addEventListener('DOMContentLoaded', leerLocalStorage);
}

// Funciones
// Función que añade el oatdrink al carrito
function compraroatdrink(e) {
  e.preventDefault();
  // Delegation para addcart
  if(e.target.classList.contains('addcart')) {
    const oatdrink = e.target.parentElement.parentElement;
    // Enviamos el oatdrink seleccionado para tomar sus datos
    leerDatosoatdrink(oatdrink);
  }
}

// Lee los datos del oatdrink
function leerDatosoatdrink(oatdrink) {
  const infooatdrink = {
    image: oatdrink.querySelector('img').src,
    titulo: oatdrink.querySelector('h4').textContent,
    Price: oatdrink.querySelector('.discount').textContent,
    id: oatdrink.querySelector('a').getAttribute('data-id')
  }
  insertarCarrito(infooatdrink);
}

// Muestra el oatdrink seleccionado en el Carrito
function insertarCarrito(oatdrink) {
  const row = document.createElement('tr');
  row.innerHTML = `
  <td>
  <img src="${oatdrink.image}" width=100>
  </td>
  <td>${oatdrink.titulo}</td>
  <td>${oatdrink.Price}</td>
  <td>
  <a href="#" class="borrar-oatdrink" data-id="${oatdrink.id}">X</a>
  </td>
  `;
  listaoatdrinks.appendChild(row);
  guardaroatdrinkLocalStorage(oatdrink);
}

// Elimina el oatdrink del carrito en el DOM
function eliminaroatdrink(e) {
  e.preventDefault();
  let oatdrink,
      oatdrinkId;
  if(e.target.classList.contains('borrar-oatdrink') ) {
    e.target.parentElement.parentElement.remove();
    oatdrink = e.target.parentElement.parentElement;
    oatdrinkId = oatdrink.querySelector('a').getAttribute('data-id');
  }
  eliminaroatdrinkLocalStorage(oatdrinkId);
}

// Elimina los oatdrinks del carrito en el DOM
function vaciarCarrito() {
  // forma lenta
  // listaoatdrinks.innerHTML = '';
  // forma rapida (recomendada)
  while(listaoatdrinks.firstChild) {
    listaoatdrinks.removeChild(listaoatdrinks.firstChild);
  }

  // Vaciar Local Storage
  vaciarLocalStorage();
  return false;
}

// Almacena oatdrinks en el carrito a Local Storage
function guardaroatdrinkLocalStorage(oatdrink) {
  let oatdrinks;
  // Toma el valor de un arreglo con datos de LS o vacio
  oatdrinks = obteneroatdrinksLocalStorage();
  // el oatdrink seleccionado se agrega al arreglo
  oatdrinks.push(oatdrink);
  localStorage.setItem('oatdrinks', JSON.stringify(oatdrinks) );
}

// Comprueba que haya elementos en Local Storage
function obteneroatdrinksLocalStorage() {
  let oatdrinksLS;
  // comprobamos si hay algo en localStorage
  if(localStorage.getItem('oatdrinks') === null) {
    oatdrinksLS = [];
  } else {
    oatdrinksLS = JSON.parse( localStorage.getItem('oatdrinks') );
  }
  return oatdrinksLS;
}

// Imprime los oatdrinks de Local Storage en el carrito
function leerLocalStorage() {
  let oatdrinksLS;
  oatdrinksLS = obteneroatdrinksLocalStorage();
  oatdrinksLS.forEach(function(oatdrink){
  // constrir el template
  const row = document.createElement('tr');
  row.innerHTML = `
  <td>
  <img src="${oatdrink.image}" width=100>
  </td>
  <td>${oatdrink.titulo}</td>
  <td>${oatdrink.Price}</td>
  <td>
  <a href="#" class="borrar-oatdrink" data-id="${oatdrink.id}">X</a>
  </td>
  `;
  listaoatdrinks.appendChild(row);
  });
}

// Elimina el oatdrink por el ID en Local Storage
function eliminaroatdrinkLocalStorage(oatdrink) {
  let oatdrinksLS;
  // Obtenemos el arreglo de oatdrinks
  oatdrinksLS = obteneroatdrinksLocalStorage();
  // Iteramos comparando el ID del oatdrink borrado con los del LS
  oatdrinksLS.forEach(function(oatdrinkLS, index) {
    if(oatdrinkLS.id === oatdrink) {
      oatdrinksLS.splice(index, 1);
    }
  });
  // Añadimos el arreglo actual a storage
  localStorage.setItem('oatdrinks', JSON.stringify(oatdrinksLS) );
}

// Elimina todos los oatdrinks de Local Storage
function vaciarLocalStorage() {
  localStorage.clear();
}
