import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Model/userModel.js";

//REGISTER 
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, city, userType } = req.body;

    // Check existing user
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (mapping frontend → DB)
    const user = await User.create({
      username: name,
      email,
      password: hashedPassword,
      number: phone,
      city: city,
      usertype: userType || "User",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        usertype: user.usertype,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
export const getalluser = async(req,res)=>{
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });
  
      res.status(200).json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    }
}
export const getUserbyid = async(req,res)=>{
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password"] },
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

export const updateUser = async(req,res)=>{
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  console.log("api for login hit");
  try {
    const { email, password } = req.body;

    // 1️⃣ Check user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        usertype: user.usertype,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4️⃣ Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        usertype: user.usertype,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
