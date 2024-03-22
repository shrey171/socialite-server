"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("routes");
const middlewares_1 = require("middlewares");
dotenv_1.default.config();
// Declarations
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const uri = process.env.DB_PROD || "";
console.log('connectDB ~ uri', uri);
// Middlewares
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, middlewares_1.verifyLogin)(['auth'])); // auth is excluded
// Routes
app.use('/auth', routes_1.authRoutes);
app.use('/posts', routes_1.postRoutes);
// Server and Database Connection
mongoose_1.default.connect(uri)
    .then(() => app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
}))
    .catch(e => console.log("Connection Failed"));
