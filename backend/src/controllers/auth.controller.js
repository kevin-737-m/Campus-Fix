require("dotenv").config();
const authModel = require('../model/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { name, password, email, role, adminPassword } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({
            message: "All are required"
        });
    }

    if (role === "admin") {
        if (adminPassword !== process.env.admin_password) {
            return res.status(401).json({
                message: "Wrong Password"
            })
        }
    }

    const present = await authModel.findOne({
        $or: [
            { name }, { email }
        ]
    })

    if (present) {
        return res.status(401).json({
            message: 'User already exists'
        });
    }

    const hash = await bcrypt.hash(password, 10);

    if (!hash) {
        return res.status(401).json({
            message: 'Password Not Hashing'
        });
    }

    const user = await authModel.create({
        name: name,
        email: email,
        password: hash,
        role
    })

    const token = jwt.sign({
        id: user._id
    }, process.env.SECRET || 'campusfix_secret_key');

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
        message: "User Registered Successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}

const login = async (req, res) => {
    const { name, password, email } = req.body;

    if ((!name && !email) || !password) {
        return res.status(400).json({
            message: "Username/Email and Password are required"
        });
    }

    const searchQuery = [];
    if (name) searchQuery.push({ name });
    if (email) searchQuery.push({ email });

    const present = await authModel.findOne({
        $or: searchQuery
    });

    if (!present) {
        return res.status(400).json({
            message: "User not found. Please register."
        });
    }

    const valid = await bcrypt.compare(password, present.password);

    if (!valid) {
        return res.status(400).json({
            message: "Password is Incorrect"
        });
    }

    const token = jwt.sign({
        id: present._id
    }, process.env.SECRET || 'campusfix_secret_key');

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
        message: "User login successfully",
        user: {
            id: present._id,
            name: present.name,
            email: present.email,
            role: present.role
        }
    });
}

const logout = async (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    };
    res.clearCookie("token", cookieOptions);
    res.status(200).json({
        message: "User logged out successfully"
    });
}

const getMe = async (req, res) => {
    try {
        const user = await authModel.findById(req.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { register, login, logout, getMe };