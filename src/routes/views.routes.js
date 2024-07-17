/** @format */

import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const router = Router();
router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realtimeproducts");
        res.status(200);
    } catch (error) {
        res.status(401);
    }
});

const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", { products });
    } catch (error) {
        res.status(500).json("Error interno del servidor");
    }
});

export default router;
