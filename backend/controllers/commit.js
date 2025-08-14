
import * as fs from "node:fs/promises";
import { json } from "node:stream/consumers";
import path from "path";
import {v4 as uuidv4} from "uuid";

async function commitRepo(message){
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const stagingPath = path.resolve(repoPath,"staging");
    const commitPath = path.join(repoPath,"commits");

    try{
        const commitID = uuidv4();
        const commitDir = path.join(commitPath,commitID);

        await fs.mkdir(commitDir,{recursive : true});
        const files = await fs.readdir(stagingPath);

        for (const file of files){
            await fs.rename(
                path.join( stagingPath,file),
                path.join(commitDir,file)
            );
        }

        await fs.writeFile( path.join(commitDir,"config.json"),JSON.stringify({message, date : new Date().toISOString()}));
        console.log("File Commited Successfully")

    }catch(err){
        console.log("Error commiting Files!.",err);
    }
} 

export default commitRepo;