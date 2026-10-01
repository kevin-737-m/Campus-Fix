const userModel = require('../model/user.model');
const { uploadFile, deleteFile } = require('../storage/storage.service');

const createPost = async (req, res) => {
    try {
        const { title, description, condition, location } = req.body;

        if (!title || !description || !condition || !location) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "An image of the issue is required" });
        }

        const result = await uploadFile(req.file.buffer);

        const post = await userModel.create({
            userId: req.id,
            title,
            description,
            condition,
            location,
            image: result.url,
            imageKitFileId: result.fileId
        });

        const populatedPost = await userModel.findById(post._id).populate("userId", "name email role");

        res.status(201).json({
            message: "Post Created Successfully",
            post: populatedPost
        });
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ message: err.message || "Failed to create post" });
    }
}

const getPost = async (req, res) => {
    try {
        const post = await userModel.find().populate("userId", "name email role").sort({ _id: -1 });

        res.status(200).json({
            message: "All Posts",
            post
        });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: err.message || "Failed to fetch posts" });
    }
}

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedPost = await userModel.findOneAndUpdate(
            {
                _id: id,
                userId: req.id
            },
            req.body,
            { new: true }
        ).populate("userId", "name email role");

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found or unauthorized" });
        }

        res.status(200).json({
            message: "Post updated successfully",
            post: updatedPost
        });

    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to update post" });
    }
} 

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const del = await userModel.findOneAndDelete({
            userId: req.id,
            _id: id
        });

        if (!del) {
            return res.status(404).json({
                message: "Post not found or unauthorized to delete"
            });
        }

        if (del.imageKitFileId) {
            try {
                await deleteFile(del.imageKitFileId);
            } catch (imageErr) {
                console.warn("Could not delete ImageKit file:", imageErr.message);
            }
        }

        res.status(200).json({
            message: "Post Deleted Successfully"
        });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ message: err.message || "Failed to delete post" });
    }
}

module.exports = { createPost, getPost, updatePost, deletePost };