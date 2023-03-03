
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors') //support diffrent port
require('dotenv').config()// for envirment variable
const port = process.env.PORT || 5000
const app = express()
const jwt = require('jsonwebtoken');
app.use(cors()) //
app.use(express.json()) //for parse

app.get('/', (req, res) => {
    res.send('Welcome To hexa-tech')

})

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.VALID_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hv3djnv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
//console.log(uri);
async function run() {
    try {
         client.connect()
        const allTask = client.db("taskDB").collection("taskcollection");
        const Allpurchase = client.db("purchaseDB").collection("purchasecollection");
        const userlogin = client.db("userLoginDB").collection("userLoginCollection");
        const userProfile = client.db("profileDB").collection("profileCollection");
        const AllExpense = client.db("ExpenseDB").collection("expenseCollection");
        const AdminTask = client.db("AdminTaskDB").collection("AdminTaskCollection");
        const Invoice = client.db("InvoiceDB").collection("InvoiceCollection");
        const SaleOrder = client.db("SaleOrderDB").collection("SaleOrderCollection");
        const ProductCollection = client.db("db-hexatech").collection("service");
        const reviews = client.db("reviewDB").collection("reviewcollection")
        const UserTrack = client.db("UserTrackDB").collection("UserTrackcollection")
        const Notice = client.db("NoticeDB").collection("Noticecollection")
        const myProfile = client.db("myProfileDB").collection("myProfilecollection")
        /* userTrack */
        /* ;
        const userlogin = client.db("userLoginDB").collection("userLoginCollection");
        const product = client.db("productDB").collection("productCollection");
        const orders = client.db("orderDB").collection("orderCollection"); */

        const verifyAdmin = async (req, res, next) => {
            const requester = req.decoded.email;
            console.log(requester)
            const requesterAccount = await userProfile.findOne({ email: requester });
            if (requesterAccount.role === 'admin') {
                next();
            }
            else {
                res.status(403).send({ message: 'forbidden' });
            }
        }


        // Rana vai:-
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
            res.send(result)
        })


        //Task
        app.post('/newTask', async (req, res) => {
            const addTask = req.body
            const result = await allTask.insertOne(addTask);
            res.send({ result: 'Added task Successfully' })
        })

        app.get('/taskAll', async (req, res) => {
            const query = {}
            const cursor = allTask.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/taskAll/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await allTask.findOne(query)
            res.send(result)
        })

        app.delete('/taskAll/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await allTask.deleteOne(query)
            res.send(result)
        })

        app.put('/taskAll/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            console.log(data)
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: data,
            }
            const result = await allTask.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.post('/purchase', async (req, res) => {
            const addpurchase = req.body
            const result = await Allpurchase.insertOne(addpurchase);
            res.send({ result: 'Added task Successfully' })
        })

        /* app.post('/profile-post', async (req, res) => {
            const submit = req.body;
            const query = {
                name: submit.name,
                }
            const exists = await Allpurchase.findOne(query);
            if (exists) {
                return res.send({ success: false, submit: exists })
            }
            const result = await Allpurchase.insertOne(submit);
            return res.send({ success: true, result });
        }) */

        app.get('/purchase', async (req, res) => {
            const query = {}
            const cursor = Allpurchase.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/purchase/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await Allpurchase.findOne(query)
            res.send(result)
        })

        app.delete('/purchase/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await Allpurchase.deleteOne(query)
            res.send(result)
        })

        app.put('/purchase/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: data,
            }
            const result = await Allpurchase.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        //Expense
        app.post('/expense', async (req, res) => {
            const addExpense = req.body
            const result = await AllExpense.insertOne(addExpense);
            res.send({ result: 'Added expense Successfully' })
        })

        app.get('/expense', async (req, res) => {
            const query = {}
            const cursor = AllExpense.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/expense/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await AllExpense.deleteOne(query)
            res.send(result)
        })

        /* admin-task */



        app.post('/admin-task', async (req, res) => {
            const addExpense = req.body
            const result = await AdminTask.insertOne(addExpense);
            res.send({ result: 'Added expense Successfully' })
        })

        // Query Email

        app.get('/admin-task/:email', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await AdminTask.findOne(query)
            return res.send(result);
        })

        app.get('/admin-task', async (req, res) => {
            const query = {}
            const cursor = AdminTask.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/admin-task/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await AdminTask.deleteOne(query)
            res.send(result)
        })
        // Sale Order
        app.post('/sale-order', async (req, res) => {
            const addsale = req.body
            const result = await SaleOrder.insertOne(addsale);
            res.send({ result: 'Added Sale Order Successfully' })
        })
        app.get('/sale-order', async (req, res) => {
            const query = {}
            const cursor = SaleOrder.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // Invoice
        app.post('/invoice', async (req, res) => {
            const addinvoice = req.body
            const result = await Invoice.insertOne(addinvoice);
            res.send({ result: 'Added invoice Successfully' })
        })
        app.get('/invoice', async (req, res) => {
            const query = {}
            const cursor = Invoice.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // post userTrack | user get service:-
        /* app.put('/userTrack', async (req, res) => {
            const userGet = req.body
            const result = await UserTrack.insertOne(userGet)
            res.send(result)
        }) */
        app.get('/userTrack', async (req, res) => {
            const query = {}
            const cursor = UserTrack.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/userTrack', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await UserTrack.findOne(query)
            return res.send(result);
        })

        app.delete('/userTrack/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await UserTrack.deleteOne(query)
            res.send(result)
        })
        app.post('/userTrack', async (req, res) => {
            const submit = req.body;
            const query = {
                name: submit.name,
                email: submit.email,
                img: submit.img,
                feature: submit.feature,
            }
            const exists = await UserTrack.findOne(query);
            if (exists) {
                return res.send({ success: false, submit: exists })
            }
            const result = await UserTrack.insertOne(submit);
            return res.send({ success: true, result });
        })







        //Review Get
        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = reviews.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/review', async (req, res) => {
            const review = req.body
            const result = await reviews.insertOne(review);
            res.send({ result: 'Added review Successfully' })
        })


        //My-Profile get
        app.get('/profile/:email', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await myProfile.findOne(query)
            return res.send(result);
        });

        /* app.get('/profile', async (req, res) => {
            const query = {}
            const cursor = myProfile.find(query)
            const result = await cursor.toArray()
            res.send(result)
        }) */

        app.post('/profile', async (req, res) => {
            const profile = req.body
            const result = await myProfile.insertOne(profile);
            res.send({ result: 'Added profile Successfully' })
        })

        app.post('/profile', async (req, res) => {
            const profile = req.body;
            const query = {
                email: profile.email,
                img: profile.photoURL,
                fname: profile.fname,
                address: profile.address,
                zip: profile.zip,
                country: profile.country,
                contact: profile.contact,
                link: profile.link,
            }
            const exists = await myProfile.findOne(query);
            if (exists) {
                return res.send({ success: false, submit: exists })
            }
            const result = await myProfile.insertOne(submit);
            return res.send({ success: true, result });
        })
        //User 
        /* app.post('/profile-post', async (req, res) => {
            const submit = req.body;
            const query = {
                name: submit.name,
                email: submit.email,
                fName: submit.fName,
                address: submit.address,
                zip: submit.zip,
                country: submit.country,
                contact: submit.contact,
                link: submit.link
            }
            const exists = await userProfile.findOne(query);
            if (exists) {
                return res.send({ success: false, submit: exists })
            }
            const result = await userProfile.insertOne(submit);
            return res.send({ success: true, result });
        }) */

        // Notice

        app.post('/notice', async (req, res) => {
            const addNotice = req.body
            const result = await Notice.insertOne(addNotice);
            res.send({ result: 'Added Notice Successfully' })
        })

        app.get('/notice', async (req, res) => {
            const notice = await Notice.find().toArray();
            res.send(notice);
        });

        app.delete('/notice/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await Notice.deleteOne(query)
            res.send(result)
        })

        app.get('/user', async (req, res) => {
            const users = await userlogin.find().toArray();
            res.send(users);
        });

        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userlogin.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin })
        })

        //make admin
        /* app.put('/user/admin/:email', verifyAdmin, async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'admin' },
            };
            const result = await userlogin.updateOne(filter, updateDoc);
            res.send(result);
        }) */
        app.put('/user/modarator/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'modarator' },
            };
            const result = await userlogin.updateOne(filter, updateDoc);
            res.send(result);
        })


        //login time
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userlogin.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.VALID_TOKEN, { expiresIn: '1h' })
            res.send({ result, token });
        });
    }
    finally {
        //await client.close()
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Show Here ${port}`)
})
