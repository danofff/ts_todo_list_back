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
exports.checkUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const jwtSecret = process.env.JWT_SECRET || "oh, yep, I can't reach environment variables";
const checkUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //check request headers
    if (req.headers && req.headers.authorization) {
        const authorizationStr = req.headers.authorization;
        //retrive token
        const token = authorizationStr.split(" ")[1] || "";
        if (token !== "") {
            try {
                //verify token
                const verifiedUser = yield jsonwebtoken_1.default.verify(token, jwtSecret);
                const { id } = verifiedUser;
                if (id) {
                    //retrive user from DB
                    const user = yield User_1.default.findById(id);
                    if (user) {
                        //set user to request
                        req.user = user;
                        return next();
                    }
                }
            }
            catch (error) {
                console.log(error);
                return next();
            }
        }
        else {
            return next();
        }
    }
    else {
        next();
    }
});
exports.checkUser = checkUser;
