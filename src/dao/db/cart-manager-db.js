/** @format */
import CartModel from "../../models/cart.model.js";
class CartManager {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear un nuevo carrito: ", error);
            throw error;
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }
            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito por su ID", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const productExist = carrito.products.find((item) => item.product.toString() === productId);
            if (productExist) {
                productExist.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            // Marco la propiedad "products" como modificada antes de guardar
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al agregar producto al carrito ", error);
            throw error;
        }
    }
}

export default CartManager;
