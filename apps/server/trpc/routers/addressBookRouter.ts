/* eslint-disable prettier/prettier */

import mongoose from "mongoose";

import { z } from "zod";
import { TTestInterface } from "../models/test";
import WorkspaceModel, { IAddressBookEntry } from "../models/Workspace";
import { protectedProcedure, router } from "../trpc";

export const addressBookRouter = router({
    getAddressBook: protectedProcedure
    .query(async ({ctx}) => {

        console.log("FIRED: getAddressBook")

        const workspace = await WorkspaceModel.findOne({_id: new mongoose.Types.ObjectId(ctx.workspaceId)}, {addressBook: 1})

        //TODO fix this:
        type TReturnType = {
            addressBookEntries: IAddressBookEntry[]
        }

        const ret: TReturnType = {addressBookEntries: workspace?.addressBook ?? [] }
        return ret
    }),

    createAddressBookEntry: protectedProcedure
    .input(z.object({
        physicalAddress: z.string(),
        addressDescription: z.string()
        
    }))
    .mutation( async ({input, ctx}) => {
        console.log("FIRED: createAddressBookEntry")
        const addressBookEntry = await WorkspaceModel.updateOne({
            _id: new mongoose.Types.ObjectId(ctx.workspaceId)
        },
        {
            $push: {addressBook: {_id: new mongoose.Types.ObjectId(), physicalAddress: input.physicalAddress, addressDescription: input.addressDescription }}
        })
        console.log(addressBookEntry)
        return "created"
    }),

    deleteAddressBookEntry: protectedProcedure
    .input(z.object({
        addressBookEntryId: z.string()
    }))
    .mutation( async ({input, ctx}) => {
        console.log("FIRED: deleteAddressBookEntry")
        await WorkspaceModel.updateOne(
            {
                _id: new mongoose.Types.ObjectId(ctx.workspaceId)
            },
            {
                $pull: {addressBook: {_id: new mongoose.Types.ObjectId(input.addressBookEntryId)}}
            }
        )
        return
    }),
  });



