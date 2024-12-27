const Blog = require("../models/Blog");

// Create a new blog
const newBlog = async (req, res) => {
    try{
        const blog = new Blog(req.body);
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(400).json({error:err.message});
    }
};

// Update blog
const updateBlog = async(req, res) => {
    try { 
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!blog) return res.status(404).json({error: "Blog not found"});
        res.status(200).json(blog);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

// Delete blog
const deleteBlog = async(req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if(!blog) return res.status(404).json({error: "Blog not found"});
        res.status(200).json({message: "Blog deleted successfully"});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};


// Get all blogs
const getAllBlogs = async( req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);      
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

// To fetch a single blog
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {newBlog, updateBlog, deleteBlog, getAllBlogs, getBlogById};