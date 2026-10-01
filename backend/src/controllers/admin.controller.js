const authModel = require('../model/auth.model');

const getAllUsers = async (req, res) => {
    try {
        const users = await authModel.find().select("-password");

        res.status(200).json({
            message: "All users",
            users
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {getAllUsers};