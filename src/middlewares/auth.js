// Middleware để làm auth
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET

const authenticate = async (req, res, next) => {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    if (!token) {
        if (!refreshToken) {
            return res.render('alert', { message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' });
        }
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            if (!refreshToken) {
                return res.status(401).json({ success: false, message: "No refresh token provided" })
            }

            try {
                const user = jwt.verify(refreshToken, JWT_SECRET);

                const newToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

                res.cookie("token", newToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 60 * 60 * 1000, // 1 giờ
                    sameSite: "Lax",
                });

                req.user = user;
                next();
            } catch (refreshError) {
                return res.render('alert', { message: 'Vui lòng đăng nhập trước' });
            }
        } else {
            // Token không hợp lệ hoặc lỗi khác
            return res.render('alert', { message: 'Vui lòng đăng nhập trước' });
        }
    }
}



export default authenticate;
