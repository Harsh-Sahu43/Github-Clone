import path from "path";
import * as fs from "node:fs/promises";

async function initRepo(){
    const repoPath = path.resolve(process.cwd(),".apnaGit");
    const commitsPath = path.join(repoPath,"commits");

    try{
        await fs.mkdir(repoPath,{recursive: true});
        await fs.mkdir(commitsPath,{recursive:true});
        await fs.writeFile(
            path.resolve(repoPath,"config.json"),
            JSON.stringify({bucket : process.env.S3_BUCKET})
        )
        console.log("Repository Initialized");
    }catch(err){
        console.log("Error Initializing Repository.",err);
    }
}

export default initRepo;