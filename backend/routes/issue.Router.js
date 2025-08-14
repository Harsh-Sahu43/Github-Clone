
import express from "express";

import {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
} from "../controllers/issueController.js";

const issueRouter = express.Router();

issueRouter.post("/issue/create/:id", createIssue);
issueRouter.put("/issue/update/:id", updateIssueById);
issueRouter.delete("/issue/delete/:id", deleteIssueById);
issueRouter.get("/issue/all", getAllIssues);
issueRouter.get("/issue/:id", getIssueById);

export default issueRouter;


