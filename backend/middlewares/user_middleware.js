import { z } from "zod";

const userSignUp = z.object({
  userName: z.string().email(),
  lastName: z.string(),
  firstName: z.string(),
  password: z.string().min(6),
});

const userSignIn = z.object({
  userName: z.string().email(),
  password: z.string().min(6),
});

const validateUserDetails = (schema) => (req, res, next) => {
  const checkReqBody = schema.safeParse(req.body);
  try {
    if (checkReqBody.success) {
      next();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validateSignUpDetails = validateUserDetails(userSignUp);
export const validateSignInDetails = validateUserDetails(userSignIn);
