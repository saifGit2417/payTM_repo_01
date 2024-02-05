import { z } from "zod";

const userSignUp = z.object({
  userName: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(6),
});

const userSignIn = z.object({
  userName: z.string().email(),
  password: z.string().min(6),
});

const updateUserDetails = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().optional(),
});

const validateUserDetails = (schema) => (req, res, next) => {
  const checkReqBody = schema.safeParse(req.body);
  try {
    if (checkReqBody.success !== false) {
      next();
    } else {
      res.status(400).json({ message: "schema validation failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const validateSignUpDetails = validateUserDetails(userSignUp);
export const validateSignInDetails = validateUserDetails(userSignIn);
export const validateUpdateUser = validateUserDetails(updateUserDetails);
