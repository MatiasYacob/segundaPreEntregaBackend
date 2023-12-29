import { Cart } from "../dao/models/cart.model.js";
import { Product } from "../dao/models/product.model.js";
import ProductManager from "./ProductManager.js";
import Swal from "sweetalert2";
const Pmanager = new ProductManager();

class CartManager {

    async getProductsInCart() {
        try {
            // Buscar el carrito existente
            const cart = await Cart.findOne({});
            
            if (!cart) {
                console.log('No se encontró un carrito.');
                return [];
            }

            // Devolver la lista de productos en el carrito
            return cart.products;
            console.log(cart.products);
        } catch (error) {
            console.error('Error al obtener productos del carrito:', error);
            return null;
        }
    }
//borrar producto
async removeProductFromCart(_id) {
    try {
        // Encontrar el carrito existente
        const cart = await Cart.findOne({});

        if (!cart) {
            return { success: false, message: 'No se encontró un carrito' };
        }

        // Verificar si el producto está en el carrito
        const productIndex = cart.products.findIndex(product => String(product._id) === String(_id));

        if (productIndex === -1) {
            return { success: false, message: 'El producto no está en el carrito' };
        }

        // Eliminar el producto del carrito
        cart.products.splice(productIndex, 1);
        await cart.save();

        console.log(`Producto ${_id} eliminado del carrito exitosamente.`);
        return { success: true, message: `Producto ${_id} eliminado del carrito` };
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        return { success: false, message: 'Error interno del servidor' };
    }
}










    async AddProductToCart(_id) {
        try {
            // Obtener el producto con la ID proporcionada
            const productToAdd = await Pmanager.getProductBy_id(_id);
            console.log(_id);
            if (!productToAdd) {
                return { success: false, message: `El producto ${_id} no existe` };
            }

            // Buscar un carrito existente
            let cart = await Cart.findOne({});

            if (!cart) {
                // Si no hay un carrito existente, crea uno nuevo con el producto
                const newCart = new Cart({
                    products: [{ productId: _id, quantity: 1 }],
                    totalPrice: productToAdd.price,
                });

                await newCart.save();
                console.log('Nuevo carrito creado exitosamente con un producto.');
                return newCart;
            }

            
              



            // Si existe un carrito, verifica si el producto ya está en el carrito
            const existingProduct = cart.products.find(item => String(item.productId) === String(_id));
                console.log("aca"+ cart.products);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                // Si el producto no está en el carrito, agrégalo
                cart.products.push({ productId: _id, quantity: 1 });
            }

            await cart.save();
            console.log(`Producto ${_id} agregado al carrito exitosamente.`);
           
            return cart;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return { success: false, message: 'Error interno del servidor' };
        }
    }
}

export default CartManager;
