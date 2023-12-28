// Importación de módulos y archivos necesarios
import express from 'express';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import { __dirname } from './dirname.js';
import viewsRouter from './routes/views.routes.js';
import ProductManager from './managers/ProductManager.js';
import mongoose from 'mongoose';
import MessageManager from './managers/MessageManager.js';
import { initializeApp } from './appInitialization.js';
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";




// Creación de la aplicación Express
const app = express();
const port = 8080;
const pManager = new ProductManager(); // Instancia de ProductManager sin pasar un archivo JSON

// Configuración de Handlebars como motor de vistas
app.engine(
    "hbs",
    handlebars.engine({
      extname: "hbs",
      defaultLayout: "main",
      handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
  );

// Creación del servidor HTTP y Socket.IO
const httpServer = app.listen(port, () =>
  console.log(`Servidor Express corriendo en el puerto ${port}`)
);
const io = new Server(httpServer);



// Conexión a la base de datos MongoDB a través de Mongoose
mongoose.connect(
  'mongodb+srv://matiasyacob27m:1234567812@clusterdesafio15.qwijtbv.mongodb.net/ClusterDesafio15'
).then(() => {
  console.log('DB connected');
}).catch((err) => {
  console.log('Hubo un error');
  console.log(err);
});







initializeApp(app, __dirname);



// Definición de rutas para la API y las vistas
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/', viewsRouter);

// Manejo de eventos de conexión y operaciones relacionadas con Socket.IO
io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');

  try {
    // Emitir los productos al cliente cuando se conecta
    socket.emit('productos', await pManager.getProducts());

    // Escuchar la creación de nuevos productos
    socket.on('post_send', async (data) => {
      try {
        // Crear un nuevo producto y emitir la lista actualizada al cliente
        const product = {
          price: Number(data.price),
          stock: Number(data.stock),
          title: data.title,
          description: data.description,
          code: data.code,
          thumbnails: data.thumbnails,
        };

        await pManager.addProduct(product);
        socket.emit('productos', await pManager.getProducts());
      } catch (error) {
        console.log(error);
      }
    });

    // Escuchar la solicitud de eliminación de un producto
    socket.on('delete_product', async (_id) => {
      try {
        // Eliminar el producto por su ID y emitir la lista actualizada al cliente
        const deletedProduct = await pManager.deleteProduct(_id);
        if (deletedProduct) {
          console.log('Producto eliminado:', deletedProduct);
          socket.emit('productos', await pManager.getProducts());
        } else {
          console.log('El producto no existe o no se pudo eliminar.');
        }
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    });
  } catch (error) {
    console.error(error);
  }
});

// Manejo de mensajes con Socket.IO
const messages = [];
const messageManager = new MessageManager();
io.on('connection', (socket) => {
  // Emitir evento cuando un nuevo usuario se conecta
  socket.on('newUser', (username) => {
    socket.broadcast.emit('userConnected', username);
  });

  // Manejar los mensajes enviados por los usuarios
  socket.on('message', async (data) => {
    messages.push(data);
    io.emit('messages', messages);
    try {
      await messageManager.addMessage(data);
      console.log('Mensaje guardado en la base de datos.');
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
    }
  });

  // Emitir mensajes existentes a un nuevo cliente
  socket.emit('messages', messages);
});

// Exportar la aplicación Express
export default app;
