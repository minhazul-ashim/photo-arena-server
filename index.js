const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { config } = require('dotenv');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

//Middlewares
app.use(express.json())
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ptzya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//The Main Function

async function run() {

    try {
        await client.connect();

        const database = client.db('pixelart')
        const photos = database.collection('photos')
        const artworks = database.collection('artworks');
        const users = database.collection('users')

        //API for retrieving all the photos;
        app.get('/photos', async (req, res) => {

            const cursor = photos.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        //API for retrieving all the artworks;
        app.get('/artworks', async (req, res) => {

            const cursor = artworks.find({})
            const result = await cursor.toArray();

            res.send(result);
        })

        //API for creating new users;
        app.post('/users', async (req, res) => {

            const { email, name } = req.body;

            const doc = { email: email, name: name }

            const result = await users.insertOne(doc)

            res.json(result)
        })

        //API for checking google users data';
        app.put('/users', async (req, res) => {

            const { email, name } = req.body;
            const filter = { email: email }
            const option = { upsert: true }
            const doc = { $set: { email: email, name: name } }

            const result = await users.updateOne(filter, doc, option)

            res.json(result)
        })
    }

    finally {

    }
}

run().catch(console.dir)


app.get('/', (req, res) => {

    res.send('The server is running')
})

app.listen(port, () => {

    console.log('The server is running')
})