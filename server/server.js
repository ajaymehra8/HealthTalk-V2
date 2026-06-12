const express=require("express");
const http=require("http");
const db=require("./config/db");
const userRoute=require("./routes/userRoutes");
const reviewRoute=require("./routes/reviewRoutes");
const cors=require('cors');
const errorMiddleware = require("./middlewares/error-middleware");
const bookingRouter=require("./routes/bookingRoutes");
const reportRouter=require("./routes/reportRoutes");
const chatRouter=require("./routes/chatRoutes");
const assistantRouter=require("./routes/assistantRoutes");
const bookingController = require("./controller/bookingController");
const { initSocket } = require("./config/socket");

require("dotenv").config();

const app=express();
// Enable CORS for localhost:8000
app.use(cors({
    origin: '*',
}));


db();

app.post(
    "/api/v1/booking/webhook",
    express.raw({ type: "application/json" }),
    bookingController.webhook
  );

app.use(express.json());

app.use("/api/v1/user",userRoute);
app.use("/api/v1/review",reviewRoute);
app.use("/api/v1/booking",bookingRouter);
app.use("/api/v1/report",reportRouter);
app.use("/api/v1/chat",chatRouter);
app.use("/api/v1/assistant",assistantRouter);

app.get("/",(req,res)=>{
    res.send("Working");
});
app.use(errorMiddleware);

const server = http.createServer(app);
const io = initSocket(server);
app.set("io", io); // make io available to controllers via req.app.get("io")

server.listen(process.env.PORT,()=>{
    console.log(`App is listening at port ${process.env.PORT}`);
})