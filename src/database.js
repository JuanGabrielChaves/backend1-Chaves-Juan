/** @format */

import mongoose from "mongoose";

// Vinculo la Base de datos usando:
mongoose
    .connect("mongodb+srv://achavesjg:inicio123*@cluster0.vwke0vh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Conexión a la Base de Datos exitosa");
    })
    .catch((error) => {
        console.log("Error al conectarse a la Base de Datos: ", error);
    });
