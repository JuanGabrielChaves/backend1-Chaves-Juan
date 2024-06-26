/** @format */

import { Router } from "express";

const router = Router();
router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realtimeproducts");
        res.status(200);
    } catch (error) {
        res.status(401);
    }
});

router.get("/products", async (req, res) => {
    res.render("home");
});

export default router;
