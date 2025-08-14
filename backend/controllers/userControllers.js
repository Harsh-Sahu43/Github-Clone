import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();
let client;
const uri = process.env.MONGODB_URI;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
}



async function signUp(req,res){
    const { username, password, email } = req.body;
    try{
        await connectClient();
        const db = await client.db("Github-Clone");
        const usersCollection = await db.collection("users");
        const user = await usersCollection.findOne({username});

        if(user){
          return res.status(400).json({message : "User already exists!"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = {
          username,
          password : hashedPassword,
          email,
          repositories :[],
          followedUsers :[],
          starRepos : [],
        }

        const result = await usersCollection.insertOne(newUser);

        const token = jwt.sign(
          {id : result.insertedId},
          process.env.JWT_SECRET_KEY,
          {expiresIn : "1h"}
        )
        res.json({token, userId : result._id});
    }catch(err){
      console.error(`Error during signup : `,err.message);
      res.status(500).json("Server Error");
    }
}

async function login(req,res) {
  const{email,password} = req.body;

  try{
    await connectClient();
    const db = await client.db("Github-Clone");
    const usersCollection = await db.collection("users");

    const user = await usersCollection.findOne({email});

    if(!user){
      return res.status(400).json({message:"Invalid Credentails!"});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      {id : user._id},
      process.env.JWT_SECRET_KEY,
      {expiresIn : "1h"}
    )
    
    res.json({token, userId : user._id});

  }catch(err){
    console.error("Error during login : ", err);
    res.status(500).send("Server error!");
  }
}


async function getAllUsers(req,res) {
   try{
     await connectClient();
     const db = await client.db("Github-Clone");
     const userCollection = await db.collection("users");

     const users = await userCollection.find({}).toArray();
     res.json(users);
   }catch(err){
    console.error("Erro during fetcing :",err.message);
    res.status(500).send("Server Error!");
   }
}


async function getUserProfile(req,res){
   const currentID = req.params.id;

   try{
      await connectClient();
      const db = await client.db("Github-Clone");
      const usersCollection = await db.collection("users");

      const user = await usersCollection.findOne({
        _id: ObjectId(currentID),
      });

       if (!user){
          return res.status(404).json({ message: "User not found!" });
       }
      res.json(user);
    }catch (err) {
      console.error("Error during fetching:", err.message);
      res.status(500).send("Server error!");
    }
}

async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("Github-Clone");
    const usersCollection = db.collection("users");

    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await usersCollection.updateOne(
      {
        _id: new ObjectId(currentID),
      },
      { $set: updateFields },
      { returnDocument: "after" }
    );
    if (!result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(result);
  } catch (err) {
    console.error("Error during updating : ", err);
    res.status(500).send("Server error!");
  }
}


async function deleteUserProfile(req,res){
  const currentID = req.params.id;

   try{
      await connectClient();
      const db =  client.db("Github-Clone");
      const userCollection =  db.collection("users");

      const result = await userCollection.deleteOne({
        _id: new ObjectId(currentID),
      },
     { returnDocument: "after" })

      console.log(result);
      if (result.deletedCount == 0) {
        return res.status(404).json({ message: "User not found!" });
      }

      res.json({ message: "User Profile Deleted!" });

   }catch (err) {
       console.error("Error during updating : ", err.message);
       res.status(500).send("Server error!");
    }
}


export {
  getAllUsers,
  signUp,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
};