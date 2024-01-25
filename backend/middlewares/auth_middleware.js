import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { User } from "../db/index.js";
export async function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  try {
    let jwtToken = authorization.split(" ")[1];
    const verifyJwt = jsonwebtoken.verify(jwtToken, JWT_SECRET);
    const { userId } = verifyJwt;
    console.log('userId: ', userId);

    const verifyUser = await User.findById(userId);
    if (verifyUser) {
      req.userId = userId;
      next();
    } else {
      res.status(403).json({
        message: "user is not authenticated to access this",
      });
    }
  } catch (error) {
    res
      .status(511)
      .json({ message: "something went wrong", error: error.message });
  }
}
