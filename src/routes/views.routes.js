import { Router } from "express";
import { Product } from "../dao/models/product.model.js";
import { Cart } from "../dao/models/cart.model.js";

const router = Router();

router.get("/", (req, res) => {
    res.render("home.hbs")
})

router.get("/realtimeproducts", (req, res) => {
    res.render("product.hbs")
})

router.get("/chat", (req, res) => {
    res.render("chat.hbs");
});


router.get("/cart", async (req, res) => {
    const { page, limit } = req.query;

    try {
        const cartResult = await Cart.paginate({}, {
            page: page || 1,
            limit: limit || 10,
        });

        const cart_productos = cartResult.docs; // Obtener solo los documentos

        console.log("Productos del carrito:", cart_productos);
        res.render("cart", {
            cart_productos
        });
    } catch (error) {
        console.error("Error al obtener productos del carrito:", error);
        res.status(500).send("Error al obtener productos del carrito");
    }
});


router.get("/products",async (req, res)=>{
    const {page, limit} = req.query



    const productos = await Product.paginate({},
        {page: page || 1,
         limit:limit ||10,
        });
    // console.log(productos);
    res.render("productos", {
        productos
    })
})



export default router;