import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import Users from "./routes/users/users";
import ExpenseTypes from "./routes/expense-types/expenseTypes";
import ExpenseCategories from "./routes/expense-categories/expenseCategories";
import ExpenseBudgets from "./routes/expense-budgets/expenseBudgets";
import Expense from "./routes/expenses/expense";
import Notifications from "./routes/expense-notifications/notifications";
import Auth from "./routes/auth/auth";
import { ValidateToken } from "./middlewares/auth/validatetoken";
import logger from "./logger";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import { ReadUserNotification } from "./controllers/expense-notifications/readUserNotification";
//For env File
dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: "/expense-notification",
  cors: {
    origin: "http://localhost:5173", // Replace with your client origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const morganFormat = ":method :url :status :response-time ms";
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.options(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(ValidateToken);
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
const port = process.env.PORT;

//routes
app.use(Auth);
app.use(Users);
app.use(ExpenseTypes);
app.use(Expense);
app.use(ExpenseCategories);
app.use(ExpenseBudgets);
app.use(Notifications);

io.on("connection", (socket) => {
  console.log("A client connected for notifications");

  // Use `socket.handshake.query` or a custom event to retrieve `userId`
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId); // Add the user to a specific room
    ReadUserNotification(userId as string);
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected from notifications");
  });
});

// Modify emitNotification to emit to the user room
export const emitNotification = (userId: string, notification: any) => {
  io.to(userId).emit(`notification`, notification); // Emits only to the specific user
};

server.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
