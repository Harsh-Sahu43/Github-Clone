import express from 'express';

import userRouter from "./user.Router.js";
import repoRouter from "./repo.Router.js";
import issueRouter from "./issue.Router.js";

const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);

mainRouter.get("/", (req,res) => {
    res.send("Welcome!");
})

export default mainRouter;  