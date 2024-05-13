const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    // save query in DB
    app.post("/add-query", async (req, res) => {
      const queryData = req.body;
      // console.log(queryData);
      const result = queryCollection.insertOne(queryData);
      res.send(result);
    });

    // get query from db
    app.get('/queries',async(req,res)=>{
      const result =await queryCollection.find().toArray();
      // console.log(result);
      res.send(result)
    })
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
