import express from "express";
import cookieParser from "cookie-parser";
import authRouter from './routes/auth.routes.js';
import morgan from "morgan";
import cors from "cors";
import chatRouter from './routes/chat.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors(
    {
        origin: ['http://localhost:5174',
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'http://localhost:3000',
        ],
        credentials: true,
        methods: 'GET,POST',
    }
))


// Health check
app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

// auth routes
app.use("/api/auth", authRouter);

// chat routes
app.use("/api/chats", chatRouter);

export default app;