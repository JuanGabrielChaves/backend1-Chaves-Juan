/** @format */

import mongoose from "mongoose";

const coleccion = "products";

// Defino el Schema: campo y tipo de dato

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    img: String,
    code: String,
    stock: Number,
    category: String,
    status: Boolean,
    thumbnails: Array,
    id: Number,
});

//Defino el Modelo:
const producsModel = mongoose.model(coleccion, productSchema);

export default producsModel;
