import { Router } from "express";
import { getCurrentDirname } from "./path.js";
import { validateProduct } from "./middlewares/productValidate.js";
import { idValidation } from "./middlewares/validateId.js";
import ProductManager from "./productManager.js";

const productRouter = Router();
const __dirname = getCurrentDirname();
const productManager = new ProductManager(`${__dirname}/products.json`);

productRouter.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.fetchProducts(limit);
        !products ? res.status(404).json({ error: "Products not found" }) : res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.get("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productManager.getProductById(productId);
        !product ? res.status(404).json({ error: "Product not found" }) : res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.post("/", validateProduct, async (req, res) => {
    try {
        const productObj = req.body;
        const newProduct = await productManager.addNewProduct(productObj);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.put("/:productId", idValidation, async (req, res) => {
    try {
        const { productId } = req.params;
        const productObj = req.body;
        const productUpdated = await productManager.modifyProduct(productId, productObj);
        !productUpdated ? res.status(404).json({ error: "Product not found" }) : res.status(200).json(productUpdated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.delete("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const prodToDelete = await productManager.deleteProduct(productId);
        !prodToDelete ? res.status(404).json({ error: "Product not found" }) : res.status(200).json(`product ${productId} deleted`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default productRouter;
