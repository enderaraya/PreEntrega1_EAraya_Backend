document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const cardContainer = document.getElementById('card-container');
    const form = document.getElementById('form');

    // Función para crear una tarjeta de producto
    const createProductCard = (product) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Categoria: ${product.category}</p>
            <p>Código: ${product.code}</p>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
        `;
        return card;
    };

    // Escuchar el evento 'newProduct' y actualizar el DOM
    socket.on('newProduct', (product) => {
        const productCard = createProductCard(product);
        cardContainer.appendChild(productCard);
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const product = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            code: formData.get('code'),
            price: formData.get('price'),
            stock: formData.get('stock'),
        };

        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })
        .then(response => response.json())
        .then(data => {
            form.reset();
            console.log('Producto agregado:', data);
            socket.emit('newProduct', data);
        })
        .catch(error => {
            console.error('Error al agregar producto:', error);
        });
    });
});
