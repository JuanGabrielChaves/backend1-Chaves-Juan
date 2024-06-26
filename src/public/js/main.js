/** @format */

const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
});

//Función para renderizar nuestros productos:

const renderProducts = (data) => {
    const contenedorProductos = document.getElementById("productsContainer");
    contenedorProductos.innerHTML = "";

    data.forEach((item) => {
        const card = document.createElement("div");

        card.innerHTML = `  <p> ${item.id} </p>
                            <p> ${item.title} </p>
                            <p> ${item.price} </p>
                            <button> Eliminar </button>
                        `;
        contenedorProductos.appendChild(card);
        //Agregamos un evento al boton de eliminar:
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id);
        });
    });
};

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
};

//Agregamos productos con el formulario:

document.getElementById("btnEnviar").addEventListener("click", () => {
    addProduct();
});

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    };

    socket.emit("addProduct", product);
};
