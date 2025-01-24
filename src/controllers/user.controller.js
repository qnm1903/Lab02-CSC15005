import { type } from "os";
import UserService from "../services/access.service.js";

export default class NoteController {
    constructor() {
        this.userService = new UserService();
    }

    getHome = async (req, res, next) => {
        try {
            const token = req.cookies.token;
            const refreshToken = req.cookies.refreshToken;
            if (!token && !refreshToken) {
                return res.redirect('/user/login-register');
            }
            return res.redirect('note');
        } catch (error) {
            next(error);
        }
    }

    getLoginRegister = async (req, res, next) => {
        try {
            res.render('login_register', {
                partials: "head.hbs",
            });
        } catch (error) {
            res.send('login/register page');
            next(error);
        }
    }

    login = async (req, res, next) => {
        try {
            const user = req.body;
            const serviceRes = await this.userService.login(user);
            if (!serviceRes.success) {
                return res.status(401).json({ success: false, message: serviceRes.message });
            }
            // Lưu token vào cookie
            res.cookie("token", serviceRes.token, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 1000, // 1 giờ
                sameSite: "Lax",
            });

            res.cookie("refreshToken", serviceRes.refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: user.remember ? 15 * 24 * 60 * 60 * 1000 : undefined, // 15 ngày
                sameSite: "Lax",
            });

            const userInfo = { name: serviceRes.user.name, email: serviceRes.user.email, username: serviceRes.user.username };
            // Trả về thành công và URL để chuyển hướng
            return res.status(200).json({
                success: "true",
                message: serviceRes.message,
                redirectURL: "/note",
                user: JSON.stringify(userInfo),
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    register = async (req, res, next) => {
        try {
            const newUser = req.body;
            const serviceRes = await this.userService.register(newUser);
            if (!serviceRes.success) {
                return res.status(400).json({ success: false, message: serviceRes.message });
            } else {
                return res.status(200).json({ success: true, message: serviceRes.message });
            }
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    refreshToken = async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            const serviceRes = await this.userService.refreshToken(refreshToken);
            if (!serviceRes.success) {
                return res.status(401).json({ success: false, message: serviceRes.message })
            }

            res.cookie('token', newToken, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 1000.
            })

            res.json({ success: true, message: "Token refreshed" });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    logout = async (req, res, next) => {
        await res.clearCookie('token');
        await res.clearCookie('refreshToken');

        return res.json({ success: true, redirectURL: '/user/login-register' });
    }
}