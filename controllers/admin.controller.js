import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Room } from "../models/room.model.js";
export const addRoom = catchAsyncError(async (req, res, next) => {
  // Extract room data from request body

  const {
    name,
    description,
    type,
    capacity,
    pricePerNight,
    features,
    availability,
    isActive,
  } = req.body;

  // Extract images from req.files if provided
  const images = req.files ? req.files.map((file) => file.path) : [];

  // Validate required fields (if not handled by schema validation)
  if (!name || !description || !type || !capacity || !pricePerNight) {
    return next(new ErrorHandler("Required fields are missing", 400));
  }

  // Create a new room instance
  const room = new Room({
    name,
    description,
    type,
    capacity,
    pricePerNight,
    features,
    images,
    availability,
    isActive,
  });

  // Save the room to the database
  const savedRoom = await room.save();

  // Respond with the created room
  return res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: savedRoom,
  });
});
export const deleteRoom = catchAsyncError(async (req, res, next) => {
  const { id: roomId } = req.params;

  // Check if the room exists
  const room = await Room.findById(roomId);
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  // Check if the room has active bookings
  const activeBookings = await Booking.find({ roomId });
  if (activeBookings.length > 0) {
    return next(
      new ErrorHandler("Cannot delete room with active bookings", 400)
    );
  }

  // Delete the room
  await Room.findByIdAndDelete(roomId);

  // Respond with success message
  return res.status(200).json({
    success: true,
    message: "Room deleted successfully",
  });
});
export const updateRoom = catchAsyncError(async (req, res, next) => {
  const { id: roomId } = req.params;
  if (!roomId) {
    return next(new ErrorHandler("You Must Provide a roomid", 400));
  }
  // Check if the room exists
  const room = await Room.findById(roomId);
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  // Update the room with the new data from req.body
  const updatedRoom = await Room.findByIdAndUpdate(roomId, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation is run
  });

  // Respond with the updated room details
  return res.status(200).json({
    success: true,
    message: "Room updated successfully",
    data: updatedRoom,
  });
});
