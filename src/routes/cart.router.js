import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ error: 'La lista de productos es inválida' });
        }

        const createdCart = await manager.createCart(products);

        if (!createdCart) {
            return res.status(500).json({ error: 'Error al crear el carrito' });
        }

        return res.status(201).json(createdCart);
    } catch (error) {
        console.error('Error en la creación del carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
