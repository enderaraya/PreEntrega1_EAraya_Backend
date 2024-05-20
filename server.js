import express from "express";
import cartRouter from './components/cartRoute.js';
import productsRoutes from './components/productRoute.js';

const SERVER_PORT = 8080;
const application = express();

application.use(express.json());
application.use(express.urlencoded({ extended: true }));

application.get("/", (req, res) => {
    res.send("¡Bienvenido a la página principal!");
});

application.use('/api/carts', cartRouter);
application.use('/api/products', productsRoutes);

application.listen(SERVER_PORT, () => {
    console.log(`Server is up and running on port ${SERVER_PORT}`);
});
