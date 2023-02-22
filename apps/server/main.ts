import cors from "cors";
import express from "express";
import * as trpcExpress from '@trpc/server/adapters/express';
import mongoose from "mongoose";
import compression from "compression";
import * as dotenv from 'dotenv'
import { appRouter, createContext } from "mp_trpc";
import msal from "@azure/msal-node"

dotenv.config()


const cca = new msal.ConfidentialClientApplication({
    auth: {
        clientId: "",
        authority: "https://login.microsoftonline.com/common",
        clientSecret: "",
    }
})

const app = express();
export = Express

app.set("view engine", "ejs");

app.use(cors());
app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext
    })
)
app.use(compression())
app.use(express.static('MP'));

app.get("/", (req, res) => {
    res.send("...");
  });

app.get("/api/auth/msLoginPopup", (req, res) => {
    res.render("login.ejs",{redirectUri: process.env.NODE_ENV === "development" ? process.env.REACT_APP_MSAL_REDIRECT_URI_DEV : process.env.REACT_APP_MSAL_REDIRECT_URI_PROD })
})





// if(process.env.NODE_ENV === "production")
// {
//     console.log("*** ERROR: REACT_APP_MSAL_REDIRECT_URI on server not set! - Exiting ***")
//     process.exit()
// }





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
    
    console.log(`api-server listening at port ${process.env.SERVER_PORT} in ${process.env.NODE_ENV} mode`);

});