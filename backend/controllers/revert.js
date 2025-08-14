
import fs from "fs";
import path from 'path';
import util from "util";

const readdir = util.promisify(fs.readdir);
const copyFile = util.promisify(fs.copyFile);

async function revertRepo(commitID){
    const repoPath = path.resolve(process.cwd(),".apnaGit");
    const commitsPath = path.join(repoPath,"commits");
    
    try{
        const commitPath = path.join(commitsPath,commitID);
        const parentPath = path.resolve(repoPath,"..");

        const files = await readdir(commitPath);
        for(const file of files){
            await copyFile( path.join(commitPath, file), path.join(parentPath,file));
        }

        console.log(`commit ${commitID} reverted successfully!.`);

    }catch(err){
        console.error("Unable to revert : ",err);
    }
}

export default revertRepo;