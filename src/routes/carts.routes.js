/** @format */

import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";
import CartModel from "../models/cart.model.js";

const router = express.Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/", async (req, res) => {
    try {
        const cart = await cartManager.obtenerCarritos();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al listar los carritos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const carrito = await cartManager.getCarritoById(cartId);
        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        return res.status(200).json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const carritoUPD = await cartManager.eliminarProductoDelCarrito(cartID, productID);

        res.json({ status: "success", message: "Producto eliminado correctamente", carritoUPD });
    } catch (error) {
        console.error("Error al eliminar producto del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.put("/:cid", async (req, res) => {
    const cartID = req.params.cid;
    const producto = req.body;

    try {
        const carrito = await cartManager.actualizarCarrito(cartID, producto);
        res.json(carrito);
    } catch (error) {
        console.error("Error al actualizar el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.put("/:cid/product/:pid", async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.oid;
        const cantidad = req.body.quantity;

        const carrito = await cartManager.actualizarCantProductoCarrito(cartID, productID, cantidad);

        res.json({ status: "success", message: "Cantidad actualizada correctamente", carrito });
    } catch (error) {
        console.error("Error al actualizar el producto del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const cartID = req.params.cid;
        const carrito = await cartManager.vaciarCarrito(cartID);
        res.json({ status: "success", message: "Se eliminaron todos los productos del carrito", carrito });
    } catch (error) {
        console.error("Error al vaciar el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
