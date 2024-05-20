import fs from 'fs';
import { v4 as generateUUID } from 'uuid';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import ProductManager from './productManager.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const productManager = new ProductManager(`${__dirname}/products.json`);

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async fetchCarts() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = await fs.promises.readFile(this.filePath, 'utf-8');
                return JSON.parse(data);
            } else {
                return [];
            }
        } catch (err) {
            console.error(err);
        }
    }

    async createCart() {
        try {
            const cart = {
                id: generateUUID(),
                products: [],
            };
            const carts = await this.fetchCarts();
            carts.push(cart);
            await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return cart;
        } catch (err) {
            console.error(err);
        }
    }

    async findCartById(cartId) {
        try {
            const carts = await this.fetchCarts();
            return carts.find(cart => cart.id === cartId) || null;
        } catch (err) {
            console.error(err);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const product = await productManager.findProductById(productId);
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            const carts = await this.fetchCarts();
            const cart = carts.find(cart => cart.id === cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const productInCart = cart.products.find(prod => prod.id === productId);
            if (!productInCart) {
                cart.products.push({ id: productId, quantity: 1 });
            } else {
                productInCart.quantity++;
            }

            const updatedCarts = carts.map(c => c.id === cartId ? cart : c);
            await fs.promises.writeFile(this.filePath, JSON.stringify(updatedCarts, null, 2));
            return cart;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export default CartManager;
