document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const form = document.getElementById('form');
    const cardContainer = document.getElementById('card-container');

    socket.on('newProduct', (product) => {
        addProductToDOM(product);
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const product = {};
        formData.forEach((value, key) => {
            product[key] = value;
        });

        try {
            const response = await fetch('/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el producto');
            }

            form.reset();
        } catch (error) {
            console.error(error);
        }
    });

    function addProductToDOM(product) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Código: ${product.code}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoría: ${product.category}</p>
        `;
        cardContainer.appendChild(productCard);
    }
});
