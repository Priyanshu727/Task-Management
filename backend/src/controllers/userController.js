import { User } from "../models/userModel.js";

import bcryptjs from "bcryptjs";

const generateToken = (id, username, role) => {
    return jwt.sign({ id, username, role }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res
            .status(400)
            .json({ success: false, messages: "Required all fields" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, messagea: "invalid email" })
    }
    if (password.length < 6) {
        return res.status(404).json({ success: false, messagea: "Password must be at leat 6 character" })
    }
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(404).json({ success: false, message: "Email already Exists" })
        }
        const user = await User.create({
            username,
            email,
            password,
            role,
        });
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.username, user.role),
        });
    } catch (error) {
        console.log("error in registration:", error);
        res.status(500).json({ success: false, message: "Interval server error" });
    }

};


const loginUser = async (req, res) => {
    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please enter valid email or password" });
    }
    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.username, user.role),
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }
    } catch (error) {
        console.error("I got Error  in Login Please check it:", error);
        res.status(500).json({ success: false, message: "I got Server Error during Login" });
    }
};



const getUsers = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error fetching users" });
    }
};

export { registerUser, loginUser, getUsers };



