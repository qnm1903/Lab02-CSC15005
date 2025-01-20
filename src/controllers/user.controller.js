import UserService from "../services/access.service.js";

export default class NoteController {
    constructor() {
        this.userService = new UserService();
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
            if(!serviceRes.success) {
                return res.status(400).json({success: "false", message: serviceRes.message});
            } else {
                return res.status(200).json({success: "true", message: serviceRes.message});
            }
        } catch (error) {
            return res.status(400).json({success: "false", message: error.message});
        }
    }

    register = async (req, res, next) => {
        try {
            const newUser = req.body;
            const serviceRes = await this.userService.register(newUser);
            if(!serviceRes.success) {
                return res.status(400).json({success: false, message: serviceRes.message});
            } else {
                return res.status(200).json({success: true, message: serviceRes.message});
            }   
        } catch (error) {
            return res.status(400).json({success: false, message: error.message});
        }
    }
}