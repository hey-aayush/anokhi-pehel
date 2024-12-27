const express = require("express");
const {newBlog, deleteBlog, updateBlog, getAllBlogs, getBlogById} = require("../controller/blogController.js");
const isAdmin = require("../middleware/authMiddleware.js")

const router = express.Router();


router.post("/blog", isAdmin, newBlog);
router.put("/blog/:id", isAdmin, updateBlog);
router.delete("/blog/:id", isAdmin, deleteBlog);
router.get('/blog/:id', isAdmin, getBlogById);
router.get("/blog", getAllBlogs);

module.exports = router;