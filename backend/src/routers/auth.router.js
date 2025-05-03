import express from "express";
import { signup, login, logout, updateProfile, checkAuth, updateSubjects, updateRating, getAverageRating, rateUser, getUserRatings, searchUsers } from "../controllers/auth.controller.js";
import {validate} from "../middlewares/userValidate.middleware.js"
import {protectRoute} from "../middlewares/protectRoute.js"  // check user logged in or not


const router = express.Router();

router.post("/signup",validate,signup)  //zod used for validation data
router.post("/login",login)
router.post("/logout",logout)
router.put("/update-profile",protectRoute,updateProfile) //update profile picture
router.put("/update-subjects",protectRoute,updateSubjects)
router.get("/check",protectRoute,checkAuth);  

router.post("/rating", protectRoute, updateRating);
router.get("/rating", getAverageRating);

// User search route
router.get("/users/search", protectRoute, searchUsers);

// User rating routes
router.post("/users/rate", protectRoute, rateUser);
router.get("/users/ratings", protectRoute, getUserRatings); 
router.get("/users/ratings/:userId", protectRoute, getUserRatings); 

export default router;