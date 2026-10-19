    
      const carrito = {};
      const btnsAgregar = document.querySelectorAll('.btn-agregar');
      const listaItems = document.getElementById('lista-items-carrito');
      const montoTotal = document.getElementById('monto-total');
      const totalCarrito = document.getElementById('total-carrito');
      const sectionCarrito = document.getElementById('resumen-carrito');

      btnsAgregar.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const articulo = e.target.closest('article');
          const id = articulo.dataset.id;
          const nombre = articulo.dataset.nombre;
          const precio = parseFloat(articulo.dataset.precio);
          const img = articulo.dataset.img;

          if (!carrito[id]) {
            carrito[id] = { id, nombre, precio, img, cantidad: 1 };
          } else {
            carrito[id].cantidad++;
          }
          
          // Feedback visual en botón
          const originalText = btn.textContent;
          btn.textContent = '✓ Agregado';
          btn.classList.add('agregado');
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('agregado');
          }, 1500);

          actualizarCarrito();
          sectionCarrito.style.display = 'block';
          sectionCarrito.scrollIntoView({ behavior: 'smooth' });
        });
      });

      function actualizarCarrito() {
        listaItems.innerHTML = '';
        let total = 0;
        let count = 0;

        Object.values(carrito).forEach(item => {
          total += item.precio * item.cantidad;
          count += item.cantidad;

          const div = document.createElement('div');
          div.className = 'item-carrito';
          div.innerHTML = `
            <img src="${item.img}" alt="${item.nombre}">
            <div class="detalle-item">
              <h4>${item.nombre}</h4>
              <p>Bs ${item.precio.toFixed(2)} x ${item.cantidad} = <strong>Bs ${(item.precio * item.cantidad).toFixed(2)}</strong></p>
              <div class="controles-cantidad">
                <button onclick="cambiarCantidad('${item.id}', -1)">-</button>
                <span>${item.cantidad}</span>
                <button onclick="cambiarCantidad('${item.id}', 1)">+</button>
              </div>
            </div>
          `;
          listaItems.appendChild(div);
        });

        montoTotal.textContent = `Bs ${total.toFixed(2)}`;
        totalCarrito.textContent = count;
      }

      window.cambiarCantidad = (id, cambio) => {
        if (carrito[id]) {
          carrito[id].cantidad += cambio;
          if (carrito[id].cantidad <= 0) delete carrito[id];
          actualizarCarrito();
          if (Object.keys(carrito).length === 0) sectionCarrito.style.display = 'none';
        }
      }
