import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Rating from "../models/rating.model.js";
import { genToken } from "../lib/genToken.js";
import cloudinary from "../lib/cloudinary.js";
import UserRating from "../models/userRating.model.js";

export const signup = async (req, res) => {
  try {
    const userData = req.userData;

    const findUser = await User.findOne({ email: userData.email });
    if (findUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = new User({
      fullname: userData.fullname,
      email: userData.email,
      password: hashedPassword
    });

    await newUser.save(); 
    genToken(newUser._id, res);

    console.log(newUser);
    return res.status(201).json({
      message: "User registered in DB"
    });

  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
export const login = async (req,res) =>{
  try{
    const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user){
    return res.status(400).json({
      message: "Wrong credentials"
    });
  }
  const isPasswordCorrect = await bcrypt.compare(password,user.password);
  if(!isPasswordCorrect){
    return res.status(400).json({
      message: "Wrong credentials"
    });
  }
  genToken(user._id,res);
  res.status(200).json({
    id:user._id,
    fullname:user.fullname,
    email:user.email,
    profilePic:user.profilePic
  });

  }catch(error){
    console.error("Error in login controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
  
}
export const logout = async (req,res) =>{
  try{
    res.cookie("jwt","",{maxAge:0});
    return res.status(200).json({
      message: "Logout successfully"
    });
  }
  catch(error){
    console.log("Error in logout controller",error);
    return res.status(400).json({
      message: "Internal server error"
    });
  }

}
export const updateProfile = async(req,res)=>{
  try{
    const {profilePic} = req.body;
    const userId = req.user._id;
    if(!profilePic){
      return res.status(400).json({
        message:"Profile pic not found"
      })
    }
    const uploadResult = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResult.secure_url},{new:true});
    res.status(200).json(updateUser);
  }catch(error){
    console.error("Error in update profile controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const checkAuth = (req,res) =>{
  try{
    res.status(200).json(req.user);
  }catch(error){
    console.error("Error in check controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const updateSubjects = async (req, res) => {
  try {
    const { subjects } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(subjects)) {
      return res.status(400).json({
        message: "Subjects must be an array"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { subjects },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in update subjects controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const updateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user._id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    await Rating.findOneAndUpdate(
      { userId },
      { rating },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Rating updated successfully" });
  } catch (error) {
    console.error("Error in update rating controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const result = await Rating.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    const averageRating = result.length > 0 ? result[0].averageRating : 0;
    const totalRatings = result.length > 0 ? result[0].totalRatings : 0;

    res.status(200).json({ averageRating, totalRatings });
  } catch (error) {
    console.error("Error in get average rating controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const rateUser = async (req, res) => {
  try {
    const { rating, ratedUserId, comment } = req.body;
    const raterId = req.user._id;

    if (raterId.toString() === ratedUserId) {
      return res.status(400).json({
        message: "You cannot rate yourself"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const ratedUser = await User.findById(ratedUserId);
    if (!ratedUser) {
      return res.status(404).json({
        message: "User to rate not found"
      });
    }

    await UserRating.findOneAndUpdate(
      { raterId, ratedUserId },
      { rating, comment },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error in rate user controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const getUserRatings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const ratings = await UserRating.find({ ratedUserId: userId })
      .populate('raterId', 'fullname profilePic')
      .sort('-createdAt');

    const stats = await UserRating.aggregate([
      { $match: { ratedUserId: new mongoose.Types.ObjectId(userId) } },
      { 
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      ratings,
      stats: stats[0] || { averageRating: 0, totalRatings: 0 }
    });
  } catch (error) {
    console.error("Error in get user ratings controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(200).json({ users: [] });
    }

    const users = await User.find({
      $or: [
        { fullname: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
    .select('fullname email profilePic')
    .limit(10);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in search users controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

