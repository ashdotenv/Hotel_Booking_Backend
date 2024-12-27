// Importing the Room model
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Booking } from "../models/booking.model.js";
import {Room} from "../models/room.model.js";
// Create Room Controller

export const bookRoom = catchAsyncError(async (req, res, next) => {
  const { roomId, startDate, endDate } = req.body;
  const bookedBy = req.user.id;

  // Validate required fields
  if (!roomId || !startDate || !endDate) {
    return next(
      new ErrorHandler("Room ID, start date, and end date are required", 400)
    );
  }

  // Check if the room exists
  const room = await Room.findById(roomId);
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  // Check if the room is available for the given dates
  const isAvailable = room.availability.every((period) => {
    return (
      new Date(endDate) < period.startDate ||
      new Date(startDate) > period.endDate // No overlap
    );
  });

  if (!isAvailable) {
    return next(
      new ErrorHandler("Room is not available for the selected dates", 400)
    );
  }

  // Create a new booking
  const booking = new Booking({
    roomId,
    bookedBy,
    startDate,
    endDate,
  });

  // Save the booking to the database
  const savedBooking = await booking.save();

  return res.status(201).json({
    success: true,
    message: "Room booked successfully",
    data: savedBooking,
  });
});

export const getAllRooms = catchAsyncError(async function (req, res, next) {
  const rooms = await Room.find();
  if (!rooms) {
    return next(new ErrorHandler("No Room is Listed", 400));
  }
  res.status(200).json(rooms);
});
export const getRoomById = catchAsyncError(async function (req, res, next) {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler("Room Id is Required", 400));
  }
  const rooms = await Room.findById(id);
  if (!rooms) {
    return next(new ErrorHandler("No Room is Listed by this Id", 400));
  }
  res.status(200).json(rooms);
});
