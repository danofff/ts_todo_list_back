"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.signupUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const saltRounds = Number.parseInt(process.env.SALT_ROUNDS || "10");
const jwtSecret = process.env.JWT_SECRET || "oh, yep, I can't reach environment variables";
const getUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const findedUser = yield User_1.default.find({ username }).exec();
    return findedUser[0];
});
//singup user
const signupUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        //username and password validation
        if (username.length < 3) {
            throw {
                message: "Username must be at least 3 characters",
                name: "UsernameValidationError",
            };
        }
        if (password.length < 6) {
            throw {
                message: "Password must be at least 6 characters",
                name: "PasswordValidationError",
            };
        }
        const isUserExist = yield getUser(username);
        //check if user already exist
        if (isUserExist) {
            const error = {
                message: `User with username ${username} already exists`,
                name: "UserAlreadyExists",
            };
            throw error;
        }
        //password crypting
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        //creating a new user
        const newUser = new User_1.default({
            username,
            password: hashedPassword,
        });
        const createdUser = yield newUser.save();
        //send successfull status and createdUser data
        res.status(201).json({
            user: {
                username: createdUser.username,
                id: createdUser._id,
            },
        });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.signupUser = signupUser;
//login user
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        //retrive user from DB
        const findedUser = yield getUser(username);
        //check if user exists
        if (!findedUser) {
            const error = {
                message: "No such user, try to signup first",
                name: "NoSuchUser",
            };
            throw error;
        }
        //check password validity
        const isValidPassword = yield bcrypt_1.default.compare(password, findedUser.password);
        if (!isValidPassword) {
            const error = {
                message: "Password is not valid for this user",
                name: "InvalidPassword",
            };
            throw error;
        }
        //generate token
        const token = yield jsonwebtoken_1.default.sign({ username: findedUser.username, id: findedUser._id }, jwtSecret);
        //send login user and generated token
        res.status(200).json({
            user: {
                id: findedUser._id,
                username: findedUser.username,
            },
            token,
        });
    }
    catch (error) {
        res.status(401).json(error);
    }
});
exports.loginUser = loginUser;
