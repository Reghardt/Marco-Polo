import cors from "cors";
import express from "express";
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from "./trpc/createContext";
import { appRouter } from "./trpc/routers/appRouter";
import mongoose from "mongoose";

const app = express();
app.use(cors());
const port = 4000;

app.get("/", (req, res) => {
    res.send("Hello from api-server");
  });

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext
    })
)

app.listen(port, () => {
    mongoose.connect('mongodb+srv://ReghardtM:cC1lQ5Cav7LfiDCv@cluster0.xgqnokb.mongodb.net/MarcoPolo?retryWrites=true&w=majority')
    .then(()=> {console.log("Mongo connected")})
    .catch(err => console.log(err))
    
    console.log(`api-server listening at http://localhost:${port}`);

});