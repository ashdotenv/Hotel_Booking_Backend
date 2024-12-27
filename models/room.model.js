import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Room name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Room description is required"],
  },
  type: {
    type: String,
    enum: ["single", "double", "suite", "deluxe"],
    required: [true, "Room type is required"],
  },
  capacity: {
    type: Number,
    required: [true, "Room capacity is required"],
    min: [1, "Capacity must be at least 1"],
  },
  pricePerNight: {
    type: Number,
    required: [true, "Price per night is required"],
    min: [0, "Price cannot be negative"],
  },
  features: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    validate: {
      validator: function (value) {
        return value.every((url) => url.startsWith("http"));
      },
      message: "All images must be valid URLs",
    },
  },
  availability: [
    {
      startDate: {
        type: Date,
        required: [true, "Start date is required"],
      },
      endDate: {
        type: Date,
        required: [true, "End date is required"],
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

roomSchema.methods.isAvailable = function (startDate, endDate) {
  return this.availability.every((period) => {
    return (
      endDate < period.startDate || startDate > period.endDate 
    );
  });
};

// Add a static method to search for rooms
roomSchema.statics.searchRooms = function (filters) {
  const query = {};

  if (filters.type) query.type = filters.type;
  if (filters.minCapacity) query.capacity = { $gte: filters.minCapacity };
  if (filters.maxPrice) query.pricePerNight = { $lte: filters.maxPrice };

  return this.find(query);
};

// Export the Room model
export const Room = mongoose.model("Room", roomSchema);

