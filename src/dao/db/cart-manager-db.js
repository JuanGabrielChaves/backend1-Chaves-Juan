/** @format */
import CartModel from "../../models/cart.model.js";
import ProductModel from "../../models/product.model.js";
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
                return null;
            }
            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito por su ID", error);
            throw error;
        }
    }

    async obtenerCarritos() {
        try {
            const carts = await CartModel.find();
            return carts;
        } catch (error) {
            console.error("Error al traer los carritos");
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

    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            if (!carrito) {
                console.log("No se encontró el carrito");
            }
            carrito.products = carrito.products.filter((item) => item.product._id.toString() !== productId);
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Error al eliminar producto del carrito", error);
            throw error;
        }
    }

    async actualizarCarrito(cartID, productoUPD) {
        try {
            const carrito = await this.getCarritoById(cartID);

            if (!carrito) {
                console.log("Carrito no encontrado");
            }
            carrito.products = productoUPD;
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Error al actualizar el carrito");
        }
    }

    async actualizarCantProductoCarrito(cartID, productID, nuevaCantidad) {
        try {
            const carrito = await this.getCarritoById(cartID);
            if (!carrito) {
                console.log("Carrito no encontrado");
            }

            const indice = carrito.products.items.findIndex((item) => item.product._id.toString() === productID);

            if (indice !== -1) {
                carrito.products[indice].quantity = nuevaCantidad;
                carrito.markModified("products");
                await carrito.save();
                return carrito;
            } else {
                console.log("Producto no encontrado en el carrito");
            }
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto");
        }
    }

    async vaciarCarrito(cartID) {
        try {
            const carrito = await this.getCarritoById(cartID);
            if (!carrito) {
                console.log("Carrito no encontrado");
            }
            carrito.products = [];
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Error al vaciar el carrito");
        }
    }
}

export default CartManager;
