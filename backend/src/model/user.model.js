const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth",
    },
    imageKitFileId: String,
    image: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;