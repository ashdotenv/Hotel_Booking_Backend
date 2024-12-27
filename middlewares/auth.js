import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
export const verifyToken = catchAsyncError(function (req, res, next) {
  
  if (!req.cookies.token) {
    return res.status(401).json({ error: "Token not Found" });
  }
  try {
    const verifiedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    if (verifiedToken) {
      req.user = verifiedToken;
      next();
    }
  } catch (error) {
    return next(new ErrorHandler("Token Not Verified", 401));
  }
});
export const verifyAdmin = catchAsyncError(function (req, res, next) {
  try {
    const verifiedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    if (!verifiedToken.role === "admin") {
      next(new ErrorHandler("you are not an admin", 400));
    }
    next()
  } catch (error) {
    return next(new ErrorHandler("Token Not Verified", 401));
  }
});
