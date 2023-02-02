import cors from "cors";
import express from "express";
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from "./trpc/createContext";
import { appRouter } from "./trpc/routers/appRouter";
import mongoose from "mongoose";
// import compression from "compression";
import * as dotenv from 'dotenv'
// import helmet from "helmet";

dotenv.config()

const app = express();
export = Express
app.use(cors());

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

// app.use(compression())
// app.use(helmet())

app.use(express.static('MP'))

app.set("view engine", "ejs");

app.get("/test", (req, res) => {
    res.render("test.ejs", {testValue: "some test value"})
})


if(!process.env.SERVER_PORT)
{
    console.log("*** ERROR: SERVER_PORT not set! - Exiting ***")
    process.exit()
}

if(!process.env.MONGO_CONNECTION)
{
    console.log("*** ERROR: MONGO_CONNECTION not set! - Exiting ***")
    process.exit()

}

app.listen(process.env.SERVER_PORT, () => {
    mongoose.connect('mongodb+srv://ReghardtM:cC1lQ5Cav7LfiDCv@cluster0.xgqnokb.mongodb.net/MarcoPolo?retryWrites=true&w=majority')
    .then(()=> {console.log("Mongo connected")})
    .catch(err => console.log(err))
    
    console.log(`api-server listening at http://localhost:${process.env.SERVER_PORT}`);

});