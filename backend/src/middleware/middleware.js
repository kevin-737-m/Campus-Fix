const jwt = require('jsonwebtoken');

const middleware = (req, res, next) => {

    const token = req.cookies?.token;

    if (!token) {
        return res.status(400).json({
            message: "Token Not Found"
        })
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(400).json({
                message: "Forbiden"
            })
        }
        req.id = user.id;
        next();
    })
}

module.exports = middleware;