import * as fs from "node:fs/promises";
import path from "path";

import {s3, S3_BUCKET} from '../config/aws-config.js';


async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath,"commits");
    
    const commitsDir = await fs.readdir(commitsPath);

    try{
        for(const commitDir of commitsDir ){
            const commitPath = path.join(commitsPath,commitDir);
            const files = await fs.readdir(commitPath);

            for(const file of files){
                const filePath = path.join(commitPath,file);
                const fileContent = await fs.readFile(filePath);

                const params = {
                    Bucket : S3_BUCKET,
                    Key : `commits/${commitDir}/${file}`,
                    Body : fileContent,
                }

                await s3.upload(params).promise();
            }
        }
        console.log("All the commits pushed to s3.")
   }catch(err){
      console.log("Error during pushing commits to S3.",err);
   }
}

export default pushRepo;