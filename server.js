import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import cartRouter from './components/cartRoute.js';
import productsRoutes from './components/productRoute.js';
import ProductManager from './components/productManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_PORT = 8080;
const application = express();
const server = createServer(application);
const io = new Server(server);


application.engine('handlebars', engine());
application.set('view engine', 'handlebars');
application.set('views', path.join(__dirname, 'views'));


application.use(express.static(path.join(__dirname, 'public')));
application.use(express.json());
application.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager(`${__dirname}/products.json`);


application.get("/", (req, res) => {
    res.render('realTimeProducts');
});


application.post('/products', async (req, res) => {
    try {
        const product = await productManager.addNewProduct(req.body);
        io.emit('newProduct', product);  
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


application.use('/api/carts', cartRouter);
application.use('/api/products', productsRoutes);


io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


server.listen(SERVER_PORT, () => {
    console.log(`Server is up and running on port ${SERVER_PORT}`);
});
