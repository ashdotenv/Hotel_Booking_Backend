// Importing required modules
import mongoose from 'mongoose';

// Define the Booking Schema
const bookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room ID is required'],
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Booking model
export const Booking = mongoose.model('Booking', bookingSchema);

