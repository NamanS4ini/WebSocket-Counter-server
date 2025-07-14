# 🔗 WebSocket Counter Server

This is the **real-time backend server** for the [Real-Time Counter application](https://github.com/NamanS4ini/WebSocket-Counter-Game). Built with **Node.js**, **Express**, **Socket.IO**, and **MongoDB**, it handles all real-time counter operations and player interactions.

---

## 🚀 Features

- 🔌 **Real-time WebSocket connections** using Socket.IO
- 🔢 **Global counter management** with persistence
- 👥 **Player count tracking** in real-time
- 📊 **Statistics tracking** (resets, regrets, all-time high)
- 🗄️ **MongoDB integration** for data persistence
- 🔄 **Auto-reconnection** support
- 🌐 **CORS enabled** for cross-origin requests

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) with TypeScript
- **Framework**: [Express.js](https://expressjs.com/)
- **WebSocket**: [Socket.IO](https://socket.io/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Environment**: [dotenv](https://github.com/motdotla/dotenv)
- **Dev Tools**: [tsx](https://github.com/esbuild-kit/tsx), [nodemon](https://nodemon.io/)

---

## 📁 Project Structure

```
server/
├── server.mts          # Main server file with Socket.IO setup
├── db.ts              # MongoDB connection configuration
├── package.json       # Dependencies and scripts
├── nodemon.json       # Development server configuration
├── tsconfig.json      # TypeScript configuration
├── tsconfig.server.json # Server-specific TypeScript config
└── models/
    └── Counter.ts     # MongoDB Counter model schema
```

---

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```env
MONGO_URI=mongodb://localhost:27017/counter
CLIENT_ORIGIN=http://localhost:3000
PORT=3001
```

### Environment Variables Explained:
- `MONGO_URI`: MongoDB connection string
- `CLIENT_ORIGIN`: Frontend URL for CORS configuration
- `PORT`: Server port (defaults to 3001)

---

## 📦 Installation & Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

---

## 🎮 Socket.IO Events

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `increment` | `counterId` | Increments the global counter by 1 |
| `reset` | `counterId` | Resets counter to 0 and increments reset count |
| `firstLoad` | `counterId` | Handles initial page load, increments player count |
| `regret` | `counterId` | Increments regret count when user regrets an action |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `counterUpdated` | `CounterData` | Broadcasts updated counter state to all clients |

### CounterData Interface

```typescript
interface CounterData {
  count: number;           // Current counter value
  allTimeHigh: number;     // Highest value ever reached
  playerCount: number;     // Current active players
  resetCount?: number;     // Total number of resets
  regretCount?: number;    // Total number of regrets
}
```

---

## 🗄️ Database Schema

### Counter Model

```typescript
interface ICounter {
  count: number;          // Current counter value
  playerCount: number;    // Number of active players
  resetCount: number;     // Total resets performed
  regretCount: number;    // Total regrets registered
  allTimeHigh: number;    // Highest value achieved
}
```

---

## 🚀 Available Scripts

```bash
# Development server with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

---

## 🔄 Development Workflow

1. **Start MongoDB**: Ensure MongoDB is running locally or use a cloud instance
2. **Configure Environment**: Set up your `.env` file with correct values
3. **Install Dependencies**: Run `npm install`
4. **Start Development**: Run `npm run dev`
5. **Monitor Logs**: Watch console for connection and event logs


---

## 📊 Monitoring & Logging

The server provides comprehensive logging for:
- Client connections/disconnections
- Counter state changes
- Database operations
- Error tracking

Example log output:
```
[dotenv] injecting env (3) from .env
MongoDB Connected
WebSocket server running on http://localhost:3001
a user connected
Counter first load count: 42
Counter alltimehigh to: 100
a user disconnected
```

---

## 🔐 Security Considerations

- **CORS Configuration**: Properly configured for production
- **Environment Variables**: Sensitive data stored securely
- **Input Validation**: Counter ID validation on all events
- **Error Handling**: Graceful error handling for database operations

---


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request