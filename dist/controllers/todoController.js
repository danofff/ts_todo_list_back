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
exports.deleteTodo = exports.editTodo = exports.postTodo = exports.getTodos = void 0;
const Todo_1 = __importDefault(require("../models/Todo"));
const getTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    //check authorized user
    if (!req.user) {
        res.status(403).json({
            name: "UnauthorizedOperation",
            message: "No todos for you. Login first",
        });
    }
    //check if authorized user have an id
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) {
        try {
            //retrieve data from DB
            const todos = yield Todo_1.default.find({ userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id });
            res.status(200).json(todos);
        }
        catch (error) {
            res.status(404).json({
                name: "SomethingWrong",
                message: "Something went wrong, try again later",
            });
        }
    }
});
exports.getTodos = getTodos;
const postTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    //check authorized user
    if (!req.user) {
        res.status(403).json({
            name: "Unauthorized",
            message: "You have no right to post todos",
        });
        return next();
    }
    try {
        const newTodo = new Todo_1.default({
            text: req.body.text,
            userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id,
        });
        const createdTodo = yield newTodo.save();
        res.status(200).json({ todo: createdTodo });
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.postTodo = postTodo;
const editTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //check if authorized user
    if (!req.user) {
        res.status(403).json({
            name: "UnauthorizedRequest",
            message: "You have no right to delete todo",
        });
        console.log("no user");
        return;
    }
    //check if :id param exists
    if (req.params && req.params.id) {
        const id = req.params.id;
        //check if stored user has an id
        if (!req.user.id) {
            res.status(403).json({
                name: "UnauthorizedRequest",
                message: "You have no right to edit todo",
            });
            return;
        }
        if (req.body && req.body.todo) {
            const editedTodo = req.body.todo;
            //retrive userId from authorized user
            const { id: userId } = req.user;
            try {
                //retrieve todo from db
                const todo = yield Todo_1.default.findById(id);
                //check if todo with todo Id exists and check if todo created by auth user
                if (todo &&
                    todo.userId &&
                    todo.userId.toString() === userId.toString()) {
                    //find and update todo
                    const editedTodoDb = yield Todo_1.default.findByIdAndUpdate(id, {
                        text: editedTodo.text,
                        editedAt: new Date(),
                        isDone: editedTodo.isDone,
                    }, {
                        new: true,
                    });
                    //send updated todo to client
                    res.status(200).send({
                        todo: editedTodoDb,
                    });
                }
                else {
                    res.status(403).json({
                        name: "UnauthorizedRequest",
                        message: "You have no right to edit this todo",
                    });
                }
            }
            catch (error) {
                res.status(404).json({
                    name: "TodoDeleteProblem",
                    message: "Could not edit Todo",
                });
            }
        }
    }
    else {
        res.status(404).json({
            name: "NoParams",
            message: "Invalid edit request",
        });
    }
});
exports.editTodo = editTodo;
const deleteTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //check if authorized user
    if (!req.user) {
        res.status(403).json({
            name: "UnauthorizedRequest",
            message: "You have no right to delete todo",
        });
        console.log("no user");
        return;
    }
    //check if :id param exists
    if (req.params && req.params.id) {
        const id = req.params.id;
        //check if stored user has an id
        if (!req.user.id) {
            res.status(403).json({
                name: "UnauthorizedRequest",
                message: "You have no right to delete todo",
            });
            console.log("no user id");
            return;
        }
        //retrive userId from authorized user
        const { id: userId } = req.user;
        try {
            //retrieve todo from db
            const todo = yield Todo_1.default.findById(id);
            //check if todo with todo Id exists and check if todo created by auth user
            if (todo && todo.userId && todo.userId.toString() === userId.toString()) {
                yield Todo_1.default.deleteOne({ _id: todo.id });
                res.status(204).send();
            }
            else {
                res.status(403).json({
                    name: "UnauthorizedRequest",
                    message: "You have no right to delete this todo",
                });
            }
        }
        catch (error) {
            res.status(404).json({
                name: "TodoDeleteProblem",
                message: "Could not delete Todo",
            });
        }
    }
    else {
        res.status(404).json({
            name: "NoParams",
            message: "Invalid delete request",
        });
    }
});
exports.deleteTodo = deleteTodo;
