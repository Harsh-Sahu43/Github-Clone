
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';


import dotenv from 'dotenv';
import cors from "cors";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';



import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import mainRouter from "./routes/main.Router.js"
import initRepo from "./controllers/init.js";
import addRepo from "./controllers/add.js";
import commitRepo from "./controllers/commit.js";
import pullRepo from "./controllers/pull.js";
import pushRepo from "./controllers/push.js";
import revertRepo from "./controllers/revert.js";


dotenv.config();

yargs(hideBin(process.argv))
  .command("start","Start the backend server.",{},startSever)
  .command("init","Initialize an empty repository.",{},initRepo)
  .command("add <file>","add a file to the repository.",
    (yargs) => {
      yargs.positional("file", {
         describe : "File to add to the staging area.",
         type : String
      })
    },
    (argv) => {
      addRepo(argv.file); 
    }
  )
  .command("commit <message>","Commit the files into repository.",
    (yargs) => {
       yargs.positional("message",{
         describe : "Provide a commit message.",
         type : String
       })
    },    
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push","Push commits to the S3",{},pushRepo)
  .command("pull","Pull commits to the S3",{},pullRepo)

  .command("revert <commitID>","Revert to a specific commit.",
    (yargs) => {
       yargs.positional("commitID",{
         describe : "commitId to revert to",
         type : "string"
       })
    },    
    (argv) => {
      revertRepo(argv.commitID); 
    }
  )
  .demandCommand(1, "You need at least one command!")
  .help()
  .argv;


async function startSever(){
   const app = express();
   const port = process.env.PORT || 3000;
   const MongoUri = process.env.MONGODB_URI;


   app.use(bodyParser.json());
   
   mongoose
       .connect(MongoUri)
       .then( () => console.log( "MongoDB connected!." ))
       .catch( (err) => console.error("Unable to connect,",err));


   app.use("/",mainRouter);

   let user = "test";

   // Creating server
   // On the Bases of our express server, we are creating http server

   const httpServer = http.createServer(app);
   const io = new Server(httpServer,{
      cors : {
        origin : "*",
        methods: ["GET","POST"]
      }
   });


   io.on('connection', (socket) => {
      socket.on("joinRooms",(userID) => {
          user = userID;
          console.log("=====");
          console.log(user);
          console.log("======");
          socket.join(userID);
      })
   })

   const db = mongoose.connection;

   // after connect we want to to fect and at once and perform all CRUD operaton one by one

   db.once('open', async () => {
      console.log("CRUD Operations called.")
      // CRUD Operations
   })

   httpServer.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
   })

}  