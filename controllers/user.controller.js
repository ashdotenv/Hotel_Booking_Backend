import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.model.js";
import path from "path";
export const Signup = catchAsyncError(async (req, res, next) => {
  const { fullname, username, email, phone, password, role } = req.body;

  if (!fullname || !username || !email || !phone || !password || !role) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("Email already registered", 409));

  user = await User.findOne({ phone });
  if (user)
    return next(new ErrorHandler("Phone number already registered", 409));

  let imageUrl = "default.jpg";
  if (req.file) {
    imageUrl = path.join("uploads", req.file.filename);
  }
  const newUser = await User.create({
    fullname,
    username,
    email,
    phone,
    password,
    role,
    image: imageUrl,
  });

  const token = newUser.generateToken();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      image: newUser.image,
    },
  });
});

export const Login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHandler("Please provide both email and password", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const token = user.generateToken();

  res
    .status(200)
    .cookie("token", token)
    .json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
      },
    });
});

export const Logout = catchAsyncError(function (req, res, next) {
  if (res.cookies.token) {
    return new ErrorHandler("User Token doesn't exist", 500);
  }
  res
    .status(500)
    .json({
      message: "Logged Out Successfully",
      success: true,
    })
    .cookie("token", null, null);
});
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { fullname, username, email, phone, password, role } = req.body;
  const userId = req.user.id; // Assuming the user's ID is available in the request

  // Find the user by their ID
  let user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if email or phone already exists in another user's profile
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(new ErrorHandler("Email already registered", 409));
    }
  }

  if (phone && phone !== user.phone) {
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return next(new ErrorHandler("Phone number already registered", 409));
    }
  }

  // If password is provided, hash it before saving
  if (password) {
    user.password = password; // You should hash this password in your User model.
  }

  // Handle image upload if a new file is provided
  let imageUrl = user.image; // Keep the current image if no new one is provided
  if (req.file) {
    imageUrl = path.join("uploads", req.file.filename); // Set the new image URL
  }

  // Update user profile fields
  user.fullname = fullname || user.fullname;
  user.username = username || user.username;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.role = role || user.role;
  user.image = imageUrl;

  // Save the updated user
  await user.save();

  // Return the updated user profile
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      image: user.image,
    },
  });
});
