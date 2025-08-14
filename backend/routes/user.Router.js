import express from 'express';
import {
  getAllUsers,
  signUp,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
} from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter.get("/allUsers", getAllUsers);
userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.get("/userProfile/:id", getUserProfile);
userRouter.put("/updateProfile/:id", updateUserProfile);
userRouter.delete("/deleteProfile/:id",deleteUserProfile);

export default userRouter;