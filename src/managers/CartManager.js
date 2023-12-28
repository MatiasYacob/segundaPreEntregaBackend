import {Cart} from "../dao/models/cart.model.js"
import {Product} from "../dao/models/product.model.js"

class CartManager {


    
    async createCart(products) {
        try {
            const totalPrice = products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
            const cart = new Cart({
                products: products.map(({ _id, quantity }) => ({ productId: _id, quantity })),
                totalPrice,
            });
            await cart.save();
            console.log('Nuevo carrito creado exitosamente.');
            return cart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            return null;
        }
    }





}
export default CartManager;
