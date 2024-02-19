import express from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';

async function start() {
    const URL = `mongodb+srv://mknewkebede:hello1234@cluster0.kamrs9y.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(URL);
    await client.connect();
    const db = client.db('Full');
    
    const app = express();
    app.use(express.json());    //is used to have access to the req.body
    app.use('/images', express.static(path.join(__dirname, '../assets'))); 
    app.use(express.static(
        path.resolve(__dirname, '../dist'),
        {
            maxAge: '1y', etag: false,
        }
    ));
    
    async function populatedCartIds(ids) {
        return Promise.all(
            ids.map(id => db.collection('products').findOne({id})
            ));
    }
    // app.get('/hello', async (req, res) => {
        //     await client.connect();
        //     const db = client.db('Full');
        //     const products = await db.collection('products').find({}).toArray();
        //     res.send(products);
        // });
        
    app.get('/api/products', async (req, res) => {
        const products = await db.collection('products').find({}).toArray();
        res.json(products);
    });
        
            
    app.get('/api/users/:userId/cart', async (req, res) => {
        const user = await db.collection('users').findOne({ id: req.params.userId });
        const populatedCart = await populatedCartIds(user?.cartItems || []);
        res.json(populatedCart);
    });

    app.get('/api/products/:productId', async (req, res) => {
        const productId = req.params.productId;
        const product = await db.collection('products').findOne({ id: productId});
        res.json(product);
    });

    app.post('/api/users/:userId/cart', async (req, res) => {
        const userId = req.params.userId;
        const productId = req.body.id;

        const existingUser = await db.collection('users').findOne({ id: userId });
        if (!existingUser) {
            await db.collection('users').insertOne({ id: userId, cartItems: []});
        }
        
        await db.collection('users').updateOne({ id: userId}, {
            $addToSet: { cartItems: productId }     //this will add product into the Array object
                                                    //$push , $addToSet there are many
        });
        const user = await db.collection('users').findOne({ id: userId });
        const populatedCart = await populatedCartIds(user?.cartItems || []);
        res.json(populatedCart);
    });

    app.delete('/api/users/:userId/cart/:productId',async (req, res) => {
        const userId = req.params.userId;
        const productId = req.params.productId;
        await db.collection('users').updateOne({ id: userId}, {
            $pull: { cartItems: productId }
        });
        const user = await db.collection('users').findOne({ id: userId});
        const populatedCart = await populatedCartIds(user?.cartItems || []);
        res.json(populatedCart);
    });

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    const port = process.env.PORT || 8000;

    app.listen(port, () => {
        console.log('Server is listening on port' + port);
    });
}

start();    //server is connected to Mongo DB