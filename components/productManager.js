import fs from "fs";
import { v4 as generateUUID } from "uuid";

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async fetchProducts(limit) {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = await fs.promises.readFile(this.filePath, "utf8");
                const parsedProducts = JSON.parse(data);
                return limit ? parsedProducts.slice(0, Math.max(0, limit)) : parsedProducts;
            } else {
                return [];
            }
        } catch (err) {
            console.error(err);
        }
    }

    async addNewProduct(productData) {
        try {
            const product = {
                id: generateUUID(),
                status: true,
                ...productData,
            };
            const products = await this.fetchProducts();
            products.push(product);
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return product;
        } catch (err) {
            console.error(err);
        }
    }

    async findProductById(productId) {
        try {
            const products = await this.fetchProducts();
            return products.find((item) => item.id === productId) || null;
        } catch (err) {
            console.error(err);
        }
    }

    async updateProduct(productId, updates) {
        try {
            const products = await this.fetchProducts();
            const index = products.findIndex((item) => item.id === productId);
            if (index === -1) return null;
            const updatedProduct = { ...products[index], ...updates };
            products[index] = updatedProduct;
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return updatedProduct;
        } catch (err) {
            console.error(err);
        }
    }

    async removeProduct(productId) {
        try {
            const products = await this.fetchProducts();
            const productToDelete = products.find((item) => item.id === productId);
            if (!productToDelete) return null;
            const updatedProducts = products.filter((item) => item.id !== productId);
            await fs.promises.writeFile(this.filePath, JSON.stringify(updatedProducts, null, 2));
            return productToDelete;
        } catch (err) {
            console.error(err);
        }
    }
}

export default ProductManager;
