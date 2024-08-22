/** @format */

import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import ProductManager from "./dao/db/product-manager-db.js";
import "./database.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionRouter from "./routes/sessions.routes.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express();
const PUERTO = 8080;

// Midlewares:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());

app.use(
    session({
        secret: "secretCoder",
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://achavesjg:inicio123*@cluster0.vwke0vh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
        }),
    })
);

//Pasport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Motores de Plantillas - Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el http://localhost:${PUERTO}`);
});

const productManager = new ProductManager();

const io = new Server(httpServer);
io.on("connection", async (socket) => {
    console.log("Cliente conectado");
    socket.emit("products", await productManager.getProducts());

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("products", await productManager.getProducts());
    });

    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        io.sockets.emit("products", await productManager.getProducts());
    });
});
