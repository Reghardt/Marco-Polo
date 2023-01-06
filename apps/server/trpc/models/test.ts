/* eslint-disable prettier/prettier */
import mongoose from "mongoose";


export type TTestInterface = {
    _id: mongoose.Types.ObjectId;
    test: string;
    test2: string;
  };