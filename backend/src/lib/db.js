import mongoose from "mongoose";
export const connectDB = async ()=>{
  try{
    await mongoose.connect("mongodb+srv://priotadoll1:y5uQjkq8mroPC88m@cluster0.oqdda8f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("connected");
  }catch(e){
    console.log(e)
  }
  
};



