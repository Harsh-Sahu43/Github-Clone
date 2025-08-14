import mongoose, { Schema } from "mongoose";

const RepositorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String
        },
        content: [
            {
                type: String
            }
        ],
        visibility: {
            type: Boolean
        },
        owner: {
            type: String,
            ref: "User",
            required: true
        },
        issues: [
            {
                type: Schema.Types.ObjectId,
                ref: "Issue"
            }
        ]
    },
    { timestamps: true } 
);

const Repository = mongoose.model("Repository", RepositorySchema);
export default Repository;