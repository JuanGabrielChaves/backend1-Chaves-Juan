/** @format */

import ProductModel from "../../models/product.model.js";

class ProductManager {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !price || !code || !stock || !category) {
                throw new Error("Todos los campos son obligatorios");
            }

            const productExist = await ProductModel.findOne({ code });
            if (productExist) {
                throw new Error("El código debe ser único");
            }

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

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === "asc" || sort === "desc") {
                    sortOptions.price = sort === "asc" ? 1 : -1;
                }
            }

            const productos = await ProductModel.find(queryOptions).sort(sortOptions).skip(skip).limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
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
