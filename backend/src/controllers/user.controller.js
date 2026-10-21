
import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
  try {
    console.log("REGISTER ROUTE HIT");
    console.log("Request body:", req.body);

    const { username, password, email } = req.body;

    // Basic validation
    if (!username || !password || !email) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const trimmedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedUsername || !normalizedEmail) {
      return res.status(400).json({
        message: "Username and email cannot be empty",
      });
    }

    if (password.length < 6 || password.length > 50) {
      return res.status(400).json({
        message: "Password must be between 6 and 50 characters",
      });
    }

    // Check whether username or email already exists
    const existingUser = await User.findOne({
      $or: [
        { username: trimmedUsername },
        { email: normalizedEmail },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    // Create new user (password is automatically hashed by pre-save hook)
    const newUser = await User.create({
      username: trimmedUsername,
      email: normalizedEmail,
      password,
    });

    return res.status(201).json({
      message: "User created successfully",
      newUser: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {

    //checking if the user already exists
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) return res.status(400).json({
      message: "User not found"
    });

    //compare password 
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) return res.status(400).json({
      message: "Invalid user or password"
    });

    res.status(200).json({
      message: "User Logged In",
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    })

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    })
  }
};

const logoutUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email
    });
    if (!user) return res.status(404).json({
      message: "User not found"
    });

    res.status(200).json({
      message: "User Logged Out Successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}
export {
  registerUser,
  loginUser,
  logoutUser,
};
