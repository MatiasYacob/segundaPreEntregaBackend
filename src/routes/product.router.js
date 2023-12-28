
//Imports
import { Router } from "express";
import ProductManager from '../managers/ProductManager.js';



//Constantes Globales
const manager = new ProductManager();
const router = Router();


//Muestra todo los Productos en el Json de Productos GET
router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        let productsToSend = await manager.getProducts(); // Espera a que se resuelva la operación asíncrona

        if (limit) {
            const parsedLimit = parseInt(limit);
            if (!isNaN(parsedLimit)) {
                productsToSend = productsToSend.slice(0, parsedLimit);
            }
        }

        res.json(productsToSend);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});


//Muestra un producto por _id GET
router.get('/:_id', async (req, res) => {
    try {
        const product_id = req.params._id; // Mantén la _id como string
        const product = await manager.getProductBy_id(product_id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el producto por _id:', error);
        res.status(500).json({ error: 'Error al obtener el producto por _id' });
    }
});
//Crear un producto nuevo con Post
router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnails, code, stock, status } = req.body;

        // Crea un nuevo objeto con la data del body
        const newProduct = {
            title,
            description,
            price: Number(price), 
            thumbnails: Array.isArray(thumbnails) ? thumbnails : [thumbnails],
            code,
            stock: Number(stock), 
            status: status || true // Si no se provee status, se establece como true por defecto
        };

        // Usa el método addProduct del ProductManager para agregar el producto
        const product = await manager.addProduct(newProduct);

        if (product) {
            res.status(201).json(product); // Producto agregado exitosamente
        } else {
            res.status(500).json({ error: 'Error al agregar el producto' }); // Hubo un error al agregar el producto
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Actualizar un producto con PUT
router.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedFields = req.body; // Los campos actualizados estarán en req.body

    try {
        const updatedProduct = await manager.updateProduct(productId, updatedFields);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});






export default router;