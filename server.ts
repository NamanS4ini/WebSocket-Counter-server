import { Server } from "socket.io";
import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import connectDB from "./db.js";
import { Counter } from "./models/Counter.js";
dotenv.config();

(async () => {
  await connectDB();
  const app = express();

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  const server = createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });

    //* Handle increment event
    socket.on("increment", async (id) => {
      const currentCounter = await Counter.findById(id);
      if (!currentCounter) return;
      console.log(currentCounter.allTimeHigh);

      const newCount = currentCounter.count + 1;
      const newHigh = Math.max(currentCounter.allTimeHigh, newCount);

      const updated = await Counter.findByIdAndUpdate(
        id,
        {
          count: newCount,
          allTimeHigh: newHigh,
        },
        { new: true }
      );

      io.emit("counterUpdated", {
        allTimeHigh: updated?.allTimeHigh || 0,
        count: updated?.count || 0,
        playerCount: updated?.playerCount || 0,
      });
      console.log(`Counter alltimehigh to: ${updated?.allTimeHigh}`);
    });

    //* Handle reset event
    socket.on("reset", async (id) => {
      console.log(id);
      const updatedCounter = await Counter.findByIdAndUpdate(
        id,
        {
          count: 0,
          $inc: { resetCount: 1 },
          playerCount: 0,
        },
        { new: true }
      );

      io.emit("counterUpdated", {
        count: updatedCounter?.count || 0,
        resetCount: updatedCounter?.resetCount || 0,
      });
      console.log(`Counter reset to: ${updatedCounter?.count}`);
      console.log(`Counter ATH to: ${updatedCounter?.allTimeHigh}`);
    });

    //* Handle first load event
    socket.on("firstLoad", async (id) => {
      const counter = await Counter.findByIdAndUpdate(
        id,
        { $inc: { playerCount: 1 } },
        { new: true }
      );
      if (!counter) {
        console.error("Counter not found");
        return;
      }
      io.emit("counterUpdated", {
        count: counter.count,
        allTimeHigh: counter.allTimeHigh,
        playerCount: counter.playerCount,
      });
      console.log(`Counter first load count: ${counter.count}`);
    });

    //* Handle regret event
    socket.on("regret", async (id) => {
      const updatedCounter = await Counter.findByIdAndUpdate(
        id,
        { $inc: { regretCount: 1 } },
        { new: true }
      );

      if (!updatedCounter) {
        console.error("Counter not found");
        return;
      }

      io.emit("counterUpdated", {
        count: updatedCounter.count,
        regretCount: updatedCounter.regretCount,
      });
      console.log(`Counter regret count: ${updatedCounter.regretCount}`);
    });
  });

  server.listen(process.env.PORT || 3001, () => {
    console.log(
      `WebSocket server running on http://localhost:${process.env.PORT || 3001}`
    );
  });
})();
