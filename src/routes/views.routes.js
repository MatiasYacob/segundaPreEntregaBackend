import { Router } from "express";
import { Product } from "../dao/models/product.model.js";

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

router.get("/products",async (req, res)=>{
    const productos = await Product.paginate()
    console.log(productos);
    res.render("productos", {
        productos
    })
})



export default router;