import mongoose from "mongoose";

const userRatingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    raterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ratedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: String,
        maxLength: 500
    }
}, 
{ timestamps: true });

// Ensure one rating per user pair
userRatingSchema.index({ raterId: 1, ratedUserId: 1 }, { unique: true });

const UserRating = mongoose.model("UserRating", userRatingSchema);
export default UserRating;