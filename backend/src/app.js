import express from "express";

const app = express(); // create an express app 

app.use(express.json()); //middleware to parse json data
app.use(express.urlencoded({ extended: true }));

//routes import 
import userRoutes from './routes/user.route.js';

//routes decleration
app.use("/api/v1/users", userRoutes);

//example route: http://127.0.0.1:4000/api/v1/users/register 

export default app;