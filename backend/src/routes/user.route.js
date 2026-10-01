const express = require('express');
const { createPost, getPost, updatePost, deletePost } = require('../controllers/user.controller');
const middleware = require('../middleware/middleware');
const authware = require('../middleware/adminware');
const { getAllUsers } = require('../controllers/admin.controller');

const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const postroute = express.Router();

postroute.post('/', middleware, upload.single('image'), createPost);
postroute.get('/', middleware, getPost);
postroute.patch('/:id', middleware, updatePost);
postroute.delete("/:id", middleware, deletePost);
postroute.get("/admin", middleware, authware, getAllUsers);


module.exports = postroute;