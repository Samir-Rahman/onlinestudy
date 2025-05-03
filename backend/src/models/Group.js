import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAdmin: { type: Boolean, default: false }
}, { _id: false });

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: String,
  timeSlot: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [memberSchema]
}, { timestamps: true });

export const Group = mongoose.model('Group', groupSchema);
