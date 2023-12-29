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



// Endpoint DELETE para eliminar todos los productos del carrito
// En tu controlador de Express para la eliminación de todos los productos del carrito
router.delete('/', async (req, res) => {
    try {
        const result = await manager.removeAllProductsFromCart();

        if (!result.success) {
            return res.status(404).json({ success: false, message: result.message });
        }

        res.json({ success: true, message: 'Todos los productos eliminados del carrito' });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

//borra un producto en particular del carrito
router.delete('/:_id', async (req, res) => {
    try {
        const productId = req.params._id;
        const result = await manager.removeProductFromCart(productId);

        if (!result.success) {
            return res.status(404).json({ success: false, message: result.message });
        }

        res.json({ success: true, message: `Producto ${productId} eliminado del carrito` });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});



//Actualizar la cantidad del producto
router.put('/:_id', async (req, res) => {
    try {
        const productId = req.params._id;
        const { quantity } = req.body;

        if (!quantity || isNaN(quantity)) {
            return res.status(400).json({ success: false, message: 'La cantidad debe ser un número válido' });
        }

        const result = await manager.updateProductQuantity(productId, Number(quantity));

        if (!result.success) {
            return res.status(404).json({ success: false, message: result.message });
        }

        res.json({ success: true, message: `Cantidad del producto ${productId} actualizada en el carrito` });
    } catch (error) {
        console.error('Error al actualizar cantidad del producto en el carrito:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

export default router;