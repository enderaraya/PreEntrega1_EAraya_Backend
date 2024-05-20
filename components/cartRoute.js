import { Router } from "express";
import { getCurrentDirname } from "./path.js";
import CartsManager from "./cartManager.js";

const cartRouter = Router();
const __dirname = getCurrentDirname();
const cartsManager = new CartsManager(`${__dirname}/carts.json`);

cartRouter.get("/", async (req, res) => {
    try {
        const carts = await cartsManager.fetchCarts();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartRouter.get("/:cartID", async (req, res) => {
    try {
        const { cartID } = req.params;
        const cart = await cartsManager.findCartById(cartID);
        !cart ? res.status(404).json({ error: "Cart not found" }) : res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartRouter.post("/", async (req, res) => {
    try {
        const cart = await cartsManager.addNewCart();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartRouter.post("/:cartID/product/:productID", async (req, res) => {
    try {
        const { cartID, productID } = req.params;
        const cart = await cartsManager.addProductToCart(cartID, productID);
        res.status(200).json(cart);  
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default cartRouter;
