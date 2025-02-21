import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";



dotenv.config();

export const signup=async (req,res)=>{
    try {
        const {fullname,email,password}=req.body;
        const isEmail=await User.findOne({email});
        if(isEmail){
            return res.status(400).json({error:"Email already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=new User({fullname,email,password:hashedPassword});
        await user.save();
        return res.status(201).json({message:"User created successfully"});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

export const login=async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"User not found"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({error:"Invalid password"});
        }
        const _token=jwt.sign({id:user._id},process.env.SECRET_KEY);
        return res.status(200).json({
            message:"Login successful",
            token:_token
        });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
