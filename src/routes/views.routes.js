/** @format */

import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";
import jwt from "jsonwebtoken";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Clave secreta para JWT
const JWT_SECRET = "coderhouse";

// Middleware para verificar JWT
function authenticateJWT(req, res, next) {
    const token = req.cookies["coderCookieToken"];
    if (!token) {
        return res.redirect("/login");
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect("/login");
        }
        req.user = user;
        next();
    });
}

router.get("/products", authenticateJWT, async (req, res) => {
    try {
        const { page = 1, limit = 2 } = req.query;
        const productos = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit),
        });

        const nuevoArray = productos.docs.map((producto) => {
            const { _id, ...rest } = producto.toObject();
            return rest;
        });

        res.render("products", {
            productos: nuevoArray,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages,
            user: req.user,
        });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: "error",
            error: "Error interno del servidor",
        });
    }
});

router.get("/carts/:cid", authenticateJWT, async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartId);

        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productosEnCarrito = carrito.products.map((item) => ({
            product: item.product.toObject(),
            //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars.
            quantity: item.quantity,
        }));

        res.render("carts", { productos: productosEnCarrito, user: req.user });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/login", (req, res) => {
    const token = req.cookies["coderCookieToken"];
    if (token) {
        return res.redirect("/productos");
    }
    res.render("login");
});

router.get("/register", (req, res) => {
    const token = req.cookies["coderCookieToken"];
    if (token) {
        return res.redirect("/productos");
    }
    res.render("register");
});

router.get("/profile", authenticateJWT, (req, res) => {
    res.render("profile", { user: req.user });
});

router.get("/products", authenticateJWT, (req, res) => {
    res.render("productos", { user: req.user });
});

export default router;
