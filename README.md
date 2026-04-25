# Perplexity

An AI-powered chat and search application that combines LLM capabilities with real-time internet search to provide intelligent, up-to-date responses.

## 🚀 Live Demo

**[Try it Live](https://perplexity-jnxai.onrender.com/)**

> ⚠️ **Note:** The project is deployed on Render's free tier. The initial load may take **30-40 seconds** as the service spins up. Thank you for your patience!

### Test Credentials
If you don't want to register, you can use the following test account:
- **Email:** mondalankur8@gmail.com
- **Password:** ankur123

## Features

- 🤖 **AI Chat Interface** - Interact with advanced language models (Google GenAI, Mistral)
- 🔍 **Web Search Integration** - Get real-time search results integrated with AI responses
- 👤 **User Authentication** - Secure login and registration with JWT tokens
- 💬 **Real-time Communication** - WebSocket-based chat with Socket.io
- 📧 **Email Notifications** - Send emails via integrated mail service
- 🎨 **Modern UI** - Beautiful responsive interface built with React and Tailwind CSS
- 📱 **Mobile Responsive** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcrypt
- **AI/LLM:** LangChain with Google GenAI and Mistral AI
- **Web Search:** Tavily API, DuckDuckGo Search
- **Real-time:** Socket.io
- **Email:** Nodemailer
- **Validation:** Express-validator, Zod

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Real-time:** Socket.io-client
- **Markdown:** React Markdown

## Folder Structure

```
├── backend/
│   ├── src/
│   │   ├── app.js                    # Express app setup
│   │   ├── config/
│   │   │   └── database.js           # MongoDB configuration
│   │   ├── controllers/
│   │   │   ├── authControllers.js    # Auth logic
│   │   │   └── chat.controller.js    # Chat logic
│   │   ├── middleware/
│   │   │   └── auth.middleware.js    # JWT verification
│   │   ├── models/
│   │   │   ├── user.model.js         # User schema
│   │   │   ├── chat.model.js         # Chat session schema
│   │   │   └── message.model.js      # Message schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Authentication endpoints
│   │   │   └── chat.routes.js        # Chat endpoints
│   │   ├── services/
│   │   │   ├── ai.service.js         # LLM integration
│   │   │   ├── internet.service.js   # Web search integration
│   │   │   └── mail.service.js       # Email service
│   │   ├── sockets/
│   │   │   └── server.socket.js      # Socket.io handlers
│   │   ├── validators/
│   │   │   └── auth.validator.js     # Input validation
│   │   └── uploads/                   # File uploads directory
│   ├── server.js                      # Server entry point
│   ├── package.json
│   └── public/                        # Static files & built frontend
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                  # React entry point
│   │   ├── app/
│   │   │   ├── App.jsx               # Main app component
│   │   │   ├── app.routes.jsx        # Route definitions
│   │   │   ├── app.store.js          # Redux store
│   │   │   └── index.css             # Global styles
│   │   ├── features/
│   │   │   ├── authentication/
│   │   │   │   ├── auth.slice.js     # Redux slice
│   │   │   │   ├── components/       # Auth components
│   │   │   │   ├── hooks/            # Custom hooks
│   │   │   │   ├── pages/            # Auth pages (Login, Register)
│   │   │   │   └── services/         # Auth API calls
│   │   │   └── chat/
│   │   │       ├── chat.slice.js     # Redux slice
│   │   │       ├── hooks/            # Custom hooks
│   │   │       ├── pages/            # Chat pages
│   │   │       └── services/         # Chat API & WebSocket
│   │   └── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── README.md
│
└── README.md
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Clone the Repository

```bash
git clone https://github.com/yourusername/perplexity.git
cd perplexity
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/perplexity

# JWT
JWT_SECRET=your_jwt_secret_key_here

# AI Services
GOOGLE_API_KEY=your_google_api_key
MISTRAL_API_KEY=your_mistral_api_key

# Search Services
TAVILY_API_KEY=your_tavily_api_key

# Email Service
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_email_password
SMTP_FROM=noreply@example.com

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Running the Project

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:5000`

**Frontend (in a new terminal):**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:** (No build step needed for Node.js)
- Ensure `.env` is configured for production
- Start with `npm start` or use a process manager like PM2

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Chat Endpoints
- `GET /api/chat` - Get user's chat history
- `POST /api/chat` - Create new chat
- `GET /api/chat/:id` - Get specific chat
- `POST /api/chat/:id/message` - Send message

### WebSocket Events
- `connect` - User connects
- `send_message` - Send chat message
- `receive_message` - Receive message response
- `typing` - Typing indicator
- `disconnect` - User disconnects

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Support

For support, email mondalankur8@gmail.com or open an issue in the GitHub repository.

---

**Built with ❤️ using Node.js, Express, React, and LangChain**
