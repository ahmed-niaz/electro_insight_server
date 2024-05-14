const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ["http://localhost:5173", "https://electro-insight.web.app"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(express.json());

const uri = `mongodb+srv://${process.env.user_DB}:${process.env.secret_KEY}@cluster0.2evw8as.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const queryCollection = client.db("electroInsight").collection("queries");
    const recommendationCollection = client
      .db("electroInsight")
      .collection("recommendation");

    // save query in DB
    app.post("/add-query", async (req, res) => {
      const queryData = req.body;
      // console.log(queryData);
      const result = queryCollection.insertOne(queryData);
      res.send(result);
    });

    // get query from db
    app.get("/queries", async (req, res) => {
      const result = await queryCollection.find().toArray();
      // console.log(result);
      res.send(result);
    });

    // get a single query
    app.get("/queries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await queryCollection.findOne(query);
      res.send(result);
    });

    // get data based on email
    app.get("/query/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "user_info.email": email };
      console.log(query);
      const result = await queryCollection.find(query).toArray();
      res.send(result);
    });

    // save recommendation in Db
    app.post("/add-recommendation", async (req, res) => {
      const queryData = req.body;
      const result = recommendationCollection.insertOne(queryData);
      res.send(result);
    });

    // // get my recommendation data on email
    // app.get("/recommendation/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { "query.query_email": email };
    //   console.log(query);
    //   const result = await recommendationCollection.find(query).toArray();
    //   res.send(result);
    // });

    // get recommendation for me
    // app.get("/recommendation-for-me/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { "user_info.email": email };
    //   console.log(query);
    //   const result = await queryCollection.find(query).toArray();
    //   res.send(result);
    // });
    // delete a query data form db
    app.delete("/query-id/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await queryCollection.deleteOne(query);
      res.send(result);
    });


// update a query
app.put("/queries/:id", async (req, res) => {
  const id = req.params.id;
  const queryData = req.body;
  const query = { _id: new ObjectId(id) };
  console.log(query);
  const options = {upsert: true}
  const updateDoc = {
    $set:{
      ...queryData
    }
  }
  const result = await queryCollection.updateOne(query,updateDoc,options)
  res.send(result)
});
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Electro Insight is running on server...");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
