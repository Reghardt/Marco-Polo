/* eslint-disable prettier/prettier */

import mongoose from "mongoose";

import { z } from "zod";
import { TTestInterface } from "../models/test";
import WorkspaceModel, { IAddressBookEntry } from "../models/Workspace";
import { protectedProcedure, router } from "../trpc";

export const addressBookRouter = router({
    getAddressBook: protectedProcedure
    .input(z.object({
      workspaceId: z.string()
    }))
    .query(async ({input}) => {
        console.log(input.workspaceId)
        const workspace = await WorkspaceModel.findOne({_id: new mongoose.Types.ObjectId(input.workspaceId)}, {addressBook: 1})
        console.log(workspace)
        //TODO fix this:
        type TReturnType = {
            addressBookEntries: IAddressBookEntry[]
        }

        const ret: TReturnType = {addressBookEntries: workspace?.addressBook ?? [] }

        return ret
    }),

    createAddressBookEntry: protectedProcedure
    .input(z.object({
        workspaceId: z.string(),
        physicalAddress: z.string(),
        addressDescription: z.string()
        
    }))
    .mutation( async ({input}) => {
        const addressBookEntry = await WorkspaceModel.updateOne({
            _id: new mongoose.Types.ObjectId(input.workspaceId)
        },
        {
            $push: {addressBook: {_id: new mongoose.Types.ObjectId(), physicalAddress: input.physicalAddress, addressDescription: input.addressDescription }}
        })
        console.log(addressBookEntry)
        return "created"
    }),

    deleteAddressBookEntry: protectedProcedure
    .input(z.object({
        workspaceId: z.string(),
        addressBookEntryId: z.string()
    }))
    .mutation( async ({input}) => {
        const deletedAddressBookEntry = await WorkspaceModel.updateOne({
        _id: new mongoose.Types.ObjectId(input.workspaceId)
        },
        {
            $pull: {addressBook: {_id: new mongoose.Types.ObjectId(input.addressBookEntryId)}}
        })
        console.log(deletedAddressBookEntry)
        return "del"
    }),
  });



