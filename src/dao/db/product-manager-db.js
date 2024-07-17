/** @format */

import ProductModel from "../../models/product.model.js";

class ProductManager {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            // Verifica campos obligatorios
            if (!title || !price || !code || !stock || !category) {
                throw new Error("Todos los campos son obligatorios");
            }

            // Verifica si el código ya existe
            const productExist = await ProductModel.findOne({ code });
            if (productExist) {
                throw new Error("El código debe ser único");
            }

            // Crea y guarda el nuevo producto
            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || [],
            });
            await newProduct.save();
        } catch (error) {
            console.error("Error al agregar producto:", error.message);
            throw new Error("Error interno del servidor");
        }
    }

    async getProducts() {
        try {
            const arrayProductos = await ProductModel.find();
            return arrayProductos;
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const buscado = await ProductModel.findById(id);
            if (!buscado) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado" + buscado);
                return buscado;
            }
        } catch (error) {
            console.log("Error al obtener el producto por su Id", error);
            throw error;
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const producto = await ProductModel.findByIdAndUpdate(id, productoActualizado);
            if (!producto) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto actualizado exitosamente");
                return producto;
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const borrado = await ProductModel.findByIdAndDelete(id);
            if (!borrado) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto eliminado exitosamente");
                return borrado;
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;
