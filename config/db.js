const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
// const uri = "mongodb+srv://ksupatmono:YG53eEDCui8kKCPA@cluster0.mks0q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = process.env.MONGODB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  autoSelectFamily: false
});

async function connectToDatabase() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    //database name: final
    return client.db('final');

  } catch(error) {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
//run().catch(console.dir);

module.exports = connectToDatabase;