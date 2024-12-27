const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const JWT_KEY = "HaHa";

const isAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        // Decode the token
        const decoded = jwt.verify(token, JWT_KEY);
        const userId = decoded.user?.id; 

        if (!userId) {
            return res.status(401).json({ error: "Invalid token structure" });
        }

        // Fetch user details from the database
        const user = await User.findById(userId); 
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the user is an admin
        if (user.isAdmin) {
            req.user = user; 
            next(); 
        } else {
            res.status(403).json({ error: "Not authorized as admin" });
        }
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = isAdmin;
