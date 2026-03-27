import User from "../../models/User.js";
import { hashPassword, generateToken, generateSalt} from "../../utils/security.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  //check if user already exists
  await User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
  });

  //generate hashed password
  //generate salt
  const salt = await generateSalt();
  const hashedPassword = await hashPassword(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    salt,
  });

  //save user to database
  await newUser.save();

  //generate token
  const token = generateToken(newUser);

  //send cookie with token
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(201).json({ message: "User registered successfully" });
}