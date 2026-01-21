import express from "express";import { deleteUser, getalluser, getUserbyid, registerUser, updateUser, loginUser } from "../Controller/userController.js";


const router = express.Router();

//CREATE USER 
router.post("/create", registerUser);

router.post("/login", loginUser);


//GET ALL USERS 
router.get("/all", getalluser);

// GET USER BY ID 
router.get("/:id",getUserbyid );

// UPDATE USER
router.put("/:id",updateUser); 

//DELETE USER
router.delete("/:id", deleteUser);
export default router;
