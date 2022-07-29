const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware:-
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.huhu6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        // Rana vai:-
        const ProductCollection = client.db("db-hexatech").collection("service");
        // Emran vai:-
        const PurchaseCollection = client.db("db-hexatech").collection("purchase");
        // Sakil vai:-
        const newTaskCollection = client.db("db-hexatech").collection('newTask');

        
        // get All product:-
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = ProductCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        // post Products:-
        app.post('/products', async (req, res) => {
            const newService = req.body
            const result = await ProductCollection.insertOne(newService)
            res.send(result)
        })
        // delete products:-
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ProductCollection.deleteOne(query)
            res.send(result)
        })
        // Edit products:-
        app.put('/editProducts/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: data,
            }
            const result = await ProductCollection.updateOne(filter, updateDoc, options)
            res.send({ result })
        })


        // Emran vai:- purchase:-
        app.post('/purchase', async (req, res) => {
            const newPurchase = req.body
            console.log(newPurchase);
            const result = await PurchaseCollection.insertOne(newPurchase)
            res.send(result)
        })


        // Sakil vai:-
        app.post('/newTask', async (req, res) => {
            const newTaskAdd = req.body;
            const result = await newTaskCollection.insertOne(newTaskAdd)
            res.send({ success: true, message: "added ", result });
        })
        app.get('/taskDetails', async (req, res) => {
            const query = {}
            const result = await newTaskCollection.find(query).toArray()
            res.send(result)
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from hexatech!')
})

app.listen(port, () => {
    console.log(`hexatech listening on port ${port}`)
})
