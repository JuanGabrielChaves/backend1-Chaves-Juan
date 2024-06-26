/** @format */

import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

const app = express();
const PUERTO = 8080;

// Midlewares:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("/src/public"));

// Motores de Plantillas - Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "/src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el http://localhost:${PUERTO}`);
});
