const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 7050;
const fileUpload = require('express-fileupload');


//Middle Ware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mvbo5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('sigma_central');
        const commonityCollection = database.collection('commonity');
        const userCollection = database.collection('users');
        const patientsCollection = database.collection('patients');
        const doctorCollection = database.collection('doctors');
        const medicineCollection = database.collection('medicine');
        const prescriptionCollection = database.collection('prescription');
        const blogCollection = database.collection('blog');
        // const userOrder = database.collection('user_order');

        // Get Service API
        app.get('/commonity', async (req, res) => {
            const cursor = commonityCollection.find({});
            const commonity = await cursor.toArray();
            res.send(commonity);
        });



        // blog post api Farid
        app.post('/addBlog', async (req, res) => {
            const { title, description, subtitle1, subDescription1, subtitle2, subDescription2, subtitle3, subDescription3, subtitle4, subDescription4, blogType, date, likes, comments } = req.body;
            const image = req.files.image.data;
            const encodedImg = image.toString('base64');
            const imageBuffer = Buffer.from(encodedImg, 'base64');
            const blogInfo = {
                title, description, subtitle1, subDescription1, subtitle2, subDescription2, subtitle3, subDescription3, subtitle4, subDescription4, blogType,date, likes, comments,
                photo: imageBuffer
            }
            const result = await blogCollection.insertOne(blogInfo);
            console.log(result);
            res.send(result);
        })
          // get all doctor 
          app.get('/Blog', async (req, res) => {
            const blog = blogCollection.find({});
            const result = await blog.toArray();
            res.send(result);
          });
        
        // app.put("/like", async (req, res) => {

        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        // })

        app.delete('/Blog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogCollection.deleteOne(query);
            res.send(result);
        })

        // farid
        /*======================================================
                        Doctors Section Starts
        ========================================================*/
        // post doctor api
        app.post('/addDoctor', async (req, res) => {
            const { name, experience, birthday, gender, phone, speciality, email, twitter, facebook, linkedin, address, eduLine1, eduLine2, eduLine3, awardFirst, awardSecond, awardThird } = req.body;
            const image = req.files.image.data;
            const encodedImg = image.toString('base64');
            const imageBuffer = Buffer.from(encodedImg, 'base64');
            const doctorInfo = {
                name, experience, birthday, gender, phone, speciality, email, twitter, facebook, linkedin, address, eduLine1, eduLine2, eduLine3, awardFirst, awardSecond, awardThird,
                photo: imageBuffer
            }
            const result = await doctorCollection.insertOne(doctorInfo);
            res.send(result);
        })

        // get all doctor 
        app.get('/doctors', async (req, res) => {
            const doctor = doctorCollection.find({});
            const result = await doctor.toArray();
            res.send(result);
        });

        // delete a single doctor
        app.delete('/doctors/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await doctorCollection.deleteOne(query);
            res.send(result);
        })

        // update doctor api
        app.put('/updateDoctor/:id', async (req, res) => {
            console.log("body", req.body);
            console.log("files", req.files);
            const id = req.params.id;
            const { name, experience, birthday, gender, phone, speciality, email, twitter, linkedin, facebook, address, eduLine1, eduLine2, eduLine3, awardFirst, awardSecond, awardThird, title, description, day, time, shift, skill1, skill2, skill3, percent1, percent2, percent3, moto } = req.body;

            const image = req.files.image.data;
            const encodedImg = image.toString('base64');
            const imageBuffer = Buffer.from(encodedImg, 'base64');

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateFile = {
                $set: {

                    name: name,
                    experience: experience,
                    birthday: birthday,
                    gender: gender,
                    phone: phone,
                    speciality: speciality,
                    email: email,
                    twitter: twitter,
                    linkedin: linkedin,
                    facebook: facebook,
                    address: address,
                    eduLine1: eduLine1,
                    eduLine2: eduLine2,
                    eduLine3: eduLine3,
                    awardFirst: awardFirst,
                    awardSecond: awardSecond,
                    awardThird: awardThird,
                    title: title,
                    description: description,
                    day: day,
                    time: time,
                    shift: shift,
                    skill1: skill1,
                    skill2: skill2,
                    skill3: skill3,
                    percent1: percent1,
                    percent2: percent2,
                    percent3: percent3,
                    moto: moto,
                    photo: imageBuffer

                },
            };
            const result = await doctorCollection.updateOne(filter, updateFile, options)
            res.send(result);
        })
        /*======================================================
                        Doctors Section Ends
        ========================================================*/
        /*======================================================
                        Medicine Section Starts
        ========================================================*/
        // post medicine api
        app.post('/medicine', async (req, res) => {
            const medicine = req.body;
            const result = await medicineCollection.insertOne(medicine);
            res.send(result);
        })

        // Medicine Api
        app.get('/medicine', async (req, res) => {
            const medicine = medicineCollection.find({});
            const result = await medicine.toArray();
            res.send(result);
        });

        // post prescription api
        app.post('/prescription', async (req, res) => {
            const prescription = req.body;
            const result = await prescriptionCollection.insertOne(prescription);
            res.send(result);
        })

        // get all prescription data
        app.get('/prescription', async (req, res) => {
            const allprescription = prescriptionCollection.find({});
            const result = await allprescription.toArray();
            res.send(result);
        })
        /*======================================================
                        Medicine Section Ends
        ========================================================*/
        /*======================================================
                        User Section Starts
        ========================================================*/
        // Get patients From Database
        app.get('/patients', async (req, res) => {
            const cursor = patientsCollection.find({});
            const patients = await cursor.toArray();
            res.send(patients);
        });

        // Get Users From Database
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });
        // Create Users By Email PassWord [Firebase]
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.json(result)
        });
        // Create And Update Users by Google Login [Firebase]
        app.put('/users', async (req, res) => {
            const user = req.body;
            const find = { email: user.email };
            const option = { upsert: true };
            const updateDoc = { $set: user }
            const result = await userCollection.updateOne(find, updateDoc, option);
            res.json(result)
        });

        
        /*======================================================
                        Users Section Ends
        ========================================================*/
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Sigma Central Hospital Server Running');
});

app.listen(port, () => {
    console.log("Sigma Central Hospital Server Port", port)
});