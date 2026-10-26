const express = require("express");
const dotenv = require('dotenv')
dotenv.config()
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = process.env.MONGODB_URI;
const clinet = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const run = async () => {
  try {
    await clinet.connect();
    const db = clinet.db("simplecrudserver2");
    const userscollection = db.collection("users");
    app.get("/users", async (req, res) => {
      const cursor = userscollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get (`/users/:id`,async(req,res)=>{
        const id = req.params.id
        const query ={_id:new ObjectId(id)}
        const result =await userscollection .findOne(query)
        res.send(result)
    })
    app.post('/users',async(req,res)=>{
      const newUser= req.body
      const result =await userscollection .insertOne(newUser)
      res.send(result)
    })
    app.patch(`/users/:id`,async(req,res)=>{
      const id= req.params.id;
      const filter={ _id : new ObjectId(id)}
      const modifiedData = req.body
      const result= {
        $set :{
          name:modifiedData.name,
          email:modifiedData.email,
          position: modifiedData.position
        }
      }
      const updatedData = await userscollection .updateOne(filter,result)
      res.send(updatedData)

    })

    app.delete(`/users/:id`,async(req,res)=>{
      const id =req.params.id
      const query= {_id : new ObjectId(id)}
      const result =await userscollection.deleteOne(query)
      res.send(result)
    })
    await clinet.db("admin").command({ ping: 1 });
    console.log("deployment successfully and pinged done");
  } finally {
    // await clinet .close()
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is sderving");
});
app.listen(port, () => {
  console.log(`now my server is serving ${port}`);
});
