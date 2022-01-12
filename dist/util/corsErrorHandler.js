"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsErrorHandler = void 0;
const corsErrorHandler = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
};
exports.corsErrorHandler = corsErrorHandler;
