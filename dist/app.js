"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const corsErrorHandler_1 = require("./util/corsErrorHandler");
const checkUser_1 = require("./util/checkUser");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
/******** app settings *********/
//json parser
app.use(express_1.default.json());
//avoid cors problem
app.use(corsErrorHandler_1.corsErrorHandler);
//authorize user
app.use(checkUser_1.checkUser);
/******* routes *********/
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
//authentication routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
app.use("/api/auth", authRoutes_1.default);
//todos routes
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
app.use("/api/todos", todoRoutes_1.default);
app.use((req, res, next) => {
    res.sendFile(path_1.default.resolve(__dirname, "public", "index.html"));
});
//retrive data from environment variables
const PORT = process.env.PORT || 8000;
const DB_CONNECTION = process.env.DB_CONNECTION_STRING || "";
//connect to DB and start the SERVER
mongoose_1.default
    .connect(DB_CONNECTION)
    .then((result) => {
    app.listen(PORT, () => {
        console.log("App is started on Port " + PORT);
    });
})
    .catch((err) => {
    console.log(err);
});
