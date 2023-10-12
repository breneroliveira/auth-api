import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserRepository from "../repository/UserRepository.js";
import UserException from "../exception/UserException.js";
import * as HttpStatus from "../../../config/constants/HttpStatus.js";
import * as secrets from "../../../config/constants/Secrets.js";

class UserService {
    async findByEmail(req) {
        try {
            const { email } = req.params;
            this.validateRequestData(email);
            let user = await UserRepository.findByEmail(email);
            this.validateUserNotFound(user);
            return {
                status: HttpStatus.SUCCESS,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            };
        } catch (err) {
            return {
                status: err.status ? err.status : HttpStatus.INTERNAL_SERVER_ERROR,
                message: err.message
            };
        }
    }

    validateRequestData(email) {
        if (!email) {
            throw new UserException(HttpStatus.BAD_REQUEST, "User email was not informed.");
        }
    }

    validateUserNotFound(user) {
        if (!user) {
            throw new UserException(HttpStatus.BAD_REQUEST, "User was not found.");
        }
    }

    async getAccessToken(req) {
        try {
            const { email, password } = req.body;
            this.validateAccessToken(email, password);
            let user = await UserRepository.findByEmail(email);
            this.validateUserNotFound(user);
            await this.validatePassword(password, user.password);
            const authUser = { id: user.id, name: user.name, email: user.email };
            const accessToken = jwt.sign({ authUser }, secrets.API_SECRET, { 
                expiresIn: "1d" 
            });
            return {
                status: HttpStatus.SUCCESS,
                accessToken
            };
        } catch (err) {
            return {
                status: err.status ? err.status : HttpStatus.INTERNAL_SERVER_ERROR,
                message: err.message
            };
        }
    }

    validateAccessToken(email, password) {
        if (!email || !password) {
            throw new UserException(
                HttpStatus.UNAUTHORIZED, 
                "Email and password must be informed."
            );
        }
    }

    async validatePassword(password, hashPassword) {
        if (!await bcrypt.compare(password, hashPassword)) {
            throw new UserException(HttpStatus.UNAUTHORIZED, "Password doesn't match.");
        }
    }
}

export default new UserService();