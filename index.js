const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = "mongodb+srv://KamalRenu:kamal143@cluster0.pihmb.mongodb.net?retryWrites=true&w=majority";

let usersList = [];

app.use(express.json())
app.use(cors({
    origin: "*"
}))

app.get("/users", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("nodecrud");
        let users = await db.collection("users").find({}).toArray();
        await connection.close();
        res.json(users);
    } catch (error) {
        console.log(error)
    }
});

app.get("/user/:id", async function (req, res) {

    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("nodecrud");
        let objId = mongodb.ObjectId(req.params.id)
        let user = await db.collection("users").findOne({ _id: objId })
        await connection.close()
        if (user) {
            res.json(user)
        } else {
            res.status(401).json({ message: "User Not Found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" })
    }
})

app.post("/create-user", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("nodecrud")
        await db.collection("users").insertOne(req.body)
        await connection.close();
        res.json({ message: "User Added" })
    } catch (error) {
        console.log(error)
    }
});

app.put("/user/:id",async function (req, res) {

    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("nodecrud");
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("users").updateMany({_id:objId},{$set:req.body})
        await connection.close();
        res.json({message : "User Updated"})
    } catch (error) {
        console.log(error)
    }
})

app.delete("/user/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("nodecrud");
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("users").deleteOne({ _id: objId })
        await connection.close();
        res.json({ message: "User Deleted" })
    } catch (error) {
        console.log(error)
    }
});
app.listen(process.env.PORT || 3001)