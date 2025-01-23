// Các hàm hỗ trợ access (Đăng nhập, đăng ký)
'use strict'

import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET

export default class UserService {
    constructor() {
        this.userModel = new UserModel();
    }

    async login(user) {
        //check username exist
        const userCheck = await this.userModel.oneByUserName(user.username);
        if (!userCheck) {
            return { success: false, message: "User does not exist" }
        }

        //check password
        const pwCheck = await bcrypt.compare(user.password, userCheck.password);
        if (!pwCheck) {
            return { success: false, message: "Incorrect password" }
        }

        //create token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15d' });

        const message = "Login succesfully"
        return { success: true, message: message, token: token, refreshToken: refreshToken };
    }

    async register(user) {
        const userExist = await this.userModel.oneByUserName(user.username);
        if (userExist) {
            return { success: false, message: "User already exists" }
        }

        const hashRounds = 10;
        const hashPassword = await bcrypt.hash(user.password, hashRounds);

        const userData = {
            name: user.name,
            email: user.email,
            username: user.username,
            password: hashPassword,
        }

        const res = await this.userModel.add(userData);
        if (!res.success) {
            return { success: false, message: "Something went wrong" }
        }
        return { success: true, message: "Register successfully" }
    }

    async refreshToken(refreshToken) {
        if (!refreshToken) {
            return { success: false, message: 'No token provided' };
        }

        try {
            //Check valid refresh token
            const payload = jwt.verify(refreshToken, JWT_SECRET);
            //Sign new token
            const newRefreshToken = jwt.sign({ id: payload.id, email: payload.email }, JWT_SECRET, { expiresIn: '1h' });
            return { success: true, accessToken: newRefreshToken };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}