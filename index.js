const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s88xr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db(`${process.env.DB_NAME}`);
        const productCollection = database.collection(`${process.env.DB_COLLECTION1}`);
        const galleryImageCollection = database.collection(`${process.env.DB_COLLECTION2}`);

        //GET API
        //For fetching all the food items
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/products/:category', async (req, res) => {
            const query = req.params;
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/productDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        // Particularly for fetching data according to the category 'burger'
        app.get('/filteredBurger', async (req, res) => {
            const query = {
                category: 'burger',
                $and: [
                    { name: { $ne: 'Bigti Burger' } },
                    { name: { $ne: 'Holm Burger' } },
                    { name: { $ne: 'Komil Burger' } },
                    { name: { $ne: 'Sough Burger' } }
                ]
            };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/gallery', async (req, res) => {
            const cursor = galleryImageCollection.find({});
            const galleryImage = await cursor.toArray();
            res.send(galleryImage);
        });


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});