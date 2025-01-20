// Middleware để làm auth
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const user = await jwt.verify(token, JWT_SECRET);

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        res.status(500).json({ success: false, message: "Failed to verify token" });
    }
}

export default authenticate;
