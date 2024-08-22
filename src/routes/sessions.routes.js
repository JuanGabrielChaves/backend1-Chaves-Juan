/** @format */

import { Router } from "express";
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import CartManager from "../dao/db/cart-manager-db.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = "coderhouse";

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, age, role } = req.body;

    try {
        const existeUser = await UserModel.findOne({ email: email });
        if (existeUser) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        const cartManager = new CartManager();
        const carrito = await cartManager.crearCarrito();

        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            cart_id: carrito._id,
            password: createHash(password),
            age,
            role: role || "usuario",
        });

        await newUser.save();

        const token = jwt.sign({ email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true,
        });

        res.redirect("/products");
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ error: `Error interno del servidor: ${error.message}` });
    }
});

// Ruta de login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userEncontrado = await UserModel.findOne({ email });
        if (!userEncontrado) {
            return res.status(401).send("Usuario no válido");
        }
        if (!isValidPassword(password, userEncontrado)) {
            return res.status(401).send("Contraseña incorrecta");
        }

        const token = jwt.sign({ email: userEncontrado.email, role: userEncontrado.role }, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true,
        });

        res.redirect("/products");
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ error: `Error interno del servidor: ${error.message}` });
    }
});

router.get("/products", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
        res.render("home", { email: req.user.email });
    } else {
        res.status(401).send("No Autenticado, Token Inválido");
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
});

//Ruta exclusiva para admins:
router.get("/admin", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).send("Solo los usuarios con perfil de admin pueden ingresar !!");
    }
    res.render("admin");
});

export default router;
