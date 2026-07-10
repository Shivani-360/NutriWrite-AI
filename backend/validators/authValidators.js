const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  name: z.string().trim().optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// Generic middleware factory: validates req.body against a zod schema
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues[0]?.message || "Invalid input";
    return res.status(400).json({ error: message });
  }
  req.body = result.data; // use parsed/sanitized data
  next();
};

module.exports = {
  registerSchema,
  loginSchema,
  validate,
};