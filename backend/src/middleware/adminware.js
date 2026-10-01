const authModel = require('../model/auth.model');

const authware = async(req, res, next) => {
    const userId = req.id;

    if (!userId) {
        return res.status(401).json({
            message: "Try register or login First"
        })
    }

    const user = await authModel.findById(userId);

    if(!user){
        return res.status(401).json({
            message:"User not Found"
        })
    }

    if (user.role !== "admin") {
        return res.status(403).json({
            message: "Only admin can access"
        })
    }
    next();
}

module.exports = authware;