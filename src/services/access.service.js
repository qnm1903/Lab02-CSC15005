// Các hàm hỗ trợ access (Đăng nhập, đăng ký)
'use strict'

import express from 'express';
import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt'

export default class UserService {
    constructor() {
        this.userModel = new UserModel();
    }

    async login(user) {
        const userCheck = await this.userModel.oneByUserName(user.username);
        if (!userCheck) {
            return { success: false, message: "User does not exist" }
        }

        const pwCheck = await bcrypt.compare(user.password, userCheck.password);
        if (!pwCheck) {
            return { success: false, message: "Incorrect password" }
        }

        const message = "Login succesfully"
        return { success: true, message: message };
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
}