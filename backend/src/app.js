import express from "express";
import cookieParser from "cookie-parser";
import authRouter from './routes/auth.routes.js';
import morgan from "morgan";
import cors from "cors";
import chatRouter from './routes/chat.routes.js';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set build path
const buildPath = path.resolve(process.cwd(), "backend", "public", "dist");


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));



app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            process.env.FRONTEND_URL,
            process.env.BACKEND_URL
        ];
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Serve static files from build directory
app.use(express.static(buildPath));

// Health check
app.get("/api/health", (req, res) => {
    res.json({ message: "Server is running" });
});


// app.use(express.static(path.join(__dirname, './public/dist')));

// Auth routes
app.use("/api/auth", authRouter);

// Chat routes
app.use("/api/chats", chatRouter);

// Wildcard route
app.get(/^\/(?!api).*/, (req, res) => {
    const indexPath = path.join(buildPath, "index.html");
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Error sending index.html:", err);
            res.status(500).send("Build files not found on server");
        }
    });
});

export default app;