/** @format */

import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import ProductManager from "./dao/db/product-manager-db.js";
import "./database.js";

const app = express();
const PUERTO = 8080;

// Midlewares:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

// Motores de Plantillas - Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el http://localhost:${PUERTO}`);
});

// const productManager = new ProductManager();
// const io = new Server(httpServer);

// io.on("connection", async (socket) => {
//     console.log("Cliente conectado");

//     socket.emit("products", await productManager.getProducts());

//     socket.on("deleteProduct", async (id) => {
//         await productManager.deleteProduct(id);
//         io.sockets.emit("products", await productManager.getProducts());
//     });

//     socket.on("addProduct", async (product) => {
//         await productManager.addProduct(product);
//         io.sockets.emit("products", await productManager.getProducts());
//     });
// });
