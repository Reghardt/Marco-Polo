import * as dbmodels from 'dbmodels';
import * as mongoose from 'mongoose';
import * as superjson from 'superjson';
import * as _trpc_server from '@trpc/server';
import * as express from 'express';
import * as qs from 'qs';
import * as express_serve_static_core from 'express-serve-static-core';
import * as trpcExpress from '@trpc/server/adapters/express';

declare const appRouter: _trpc_server.CreateRouterInner<_trpc_server.RootConfig<{
    ctx: {
        req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
        res: express.Response<any, Record<string, any>>;
    };
    meta: object;
    errorShape: _trpc_server.DefaultErrorShape;
    transformer: typeof superjson.default;
}>, {
    auth: _trpc_server.CreateRouterInner<_trpc_server.RootConfig<{
        ctx: {
            req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
            res: express.Response<any, Record<string, any>>;
        };
        meta: object;
        errorShape: _trpc_server.DefaultErrorShape;
        transformer: typeof superjson.default;
    }>, {
        loginMs: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: {
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            };
            _input_in: {
                microsoftIdToken: string;
            };
            _input_out: {
                microsoftIdToken: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, {
            accessToken: string;
        }>;
    }>;
    workspaces: _trpc_server.CreateRouterInner<_trpc_server.RootConfig<{
        ctx: {
            req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
            res: express.Response<any, Record<string, any>>;
        };
        meta: object;
        errorShape: _trpc_server.DefaultErrorShape;
        transformer: typeof superjson.default;
    }>, {
        createWorkspace: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                workspaceName: string;
                descriptionPurpose: string;
            };
            _input_out: {
                workspaceName: string;
                descriptionPurpose: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, boolean>;
        getWorkspaces: _trpc_server.BuildProcedure<"query", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: typeof _trpc_server.unsetMarker;
            _input_out: typeof _trpc_server.unsetMarker;
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, {
            _id: mongoose.Types.ObjectId;
            workspaceName: string;
            descriptionPurpose: string;
            tokens: number;
        }[]>;
        doesWorkspaceExist: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: typeof _trpc_server.unsetMarker;
            _input_out: typeof _trpc_server.unsetMarker;
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, {
            doesExist: boolean;
        }>;
        getMemberData: _trpc_server.BuildProcedure<"query", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: typeof _trpc_server.unsetMarker;
            _input_out: typeof _trpc_server.unsetMarker;
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, {
            memberId: string;
            memberRole: string;
            lastUsedVehicleId: string;
            lastUsedFuelPrice: number;
        }>;
        setActiveWorkspace: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                workspaceId: string;
            };
            _input_out: {
                workspaceId: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, string>;
        inviteUserToWorkspace: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                userNameAndTag: string;
            };
            _input_out: {
                userNameAndTag: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, {
            invited: boolean;
            message: string;
        }>;
        getUserNameAndTag: _trpc_server.BuildProcedure<"query", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: typeof _trpc_server.unsetMarker;
            _input_out: typeof _trpc_server.unsetMarker;
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, string>;
        getAvailableTokens: _trpc_server.BuildProcedure<"query", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: typeof _trpc_server.unsetMarker;
            _input_out: typeof _trpc_server.unsetMarker;
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, number>;
        subtractTokens: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                amount: number;
            };
            _input_out: {
                amount: number;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, void>;
    }>;
    addressBook: _trpc_server.CreateRouterInner<_trpc_server.RootConfig<{
        ctx: {
            req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
            res: express.Response<any, Record<string, any>>;
        };
        meta: object;
        errorShape: _trpc_server.DefaultErrorShape;
        transformer: typeof superjson.default;
    }>, {
        getAddressBook: _trpc_server.BuildProcedure<"query", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: typeof _trpc_server.unsetMarker;
            _input_out: typeof _trpc_server.unsetMarker;
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, {
            addressBookEntries: dbmodels.IAddressBookEntry[];
        }>;
        createAddressBookEntry: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                physicalAddress: string;
                addressDescription: string;
            };
            _input_out: {
                physicalAddress: string;
                addressDescription: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, string>;
        deleteAddressBookEntry: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                addressBookEntryId: string;
            };
            _input_out: {
                addressBookEntryId: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, void>;
    }>;
    vehicle: _trpc_server.CreateRouterInner<_trpc_server.RootConfig<{
        ctx: {
            req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
            res: express.Response<any, Record<string, any>>;
        };
        meta: object;
        errorShape: _trpc_server.DefaultErrorShape;
        transformer: typeof superjson.default;
    }>, {
        vehicleList: _trpc_server.BuildProcedure<"query", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: typeof _trpc_server.unsetMarker;
            _input_out: typeof _trpc_server.unsetMarker;
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, {
            vehicleList: dbmodels.IVehicleListEntry[];
        }>;
        createVehicle: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                vehicleDescription: string;
                vehicleLicencePlate: string;
                litersPer100km: number;
                additionalCost: number;
                additionalCostType: number;
                vehicleClass: string;
            };
            _input_out: {
                vehicleDescription: string;
                vehicleLicencePlate: string;
                litersPer100km: number;
                additionalCost: number;
                additionalCostType: number;
                vehicleClass: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, void>;
        deleteVehicle: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                vehicleId: string;
            };
            _input_out: {
                vehicleId: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, void>;
        setLastUsedVehicle: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                vehicleId: string;
            };
            _input_out: {
                vehicleId: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, void>;
        getVehicleById: _trpc_server.BuildProcedure<"query", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                vehicleId: string;
            };
            _input_out: {
                vehicleId: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, {
            _id: mongoose.Types.ObjectId;
            vehicle: dbmodels.IVehicleListEntry;
        }>;
        setFuelPrice: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                fuelPrice: string;
            };
            _input_out: {
                fuelPrice: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, void>;
    }>;
    driver: _trpc_server.CreateRouterInner<_trpc_server.RootConfig<{
        ctx: {
            req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
            res: express.Response<any, Record<string, any>>;
        };
        meta: object;
        errorShape: _trpc_server.DefaultErrorShape;
        transformer: typeof superjson.default;
    }>, {
        addDriver: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                username: string;
            };
            _input_out: {
                username: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, void>;
        getDrivers: _trpc_server.BuildProcedure<"query", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: typeof _trpc_server.unsetMarker;
            _input_out: typeof _trpc_server.unsetMarker;
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, (dbmodels.IDriver & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[]>;
        sendTripToDriver: _trpc_server.BuildProcedure<"mutation", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: _trpc_server.Overwrite<{
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            }, {
                workspaceId: string;
                userId: string;
            }>;
            _input_in: {
                assignedDriverId: string;
                legs: {
                    givenAddress: string;
                    fullAddressStr: string;
                    legDetails: {
                        name: string;
                        value: string;
                    }[];
                    avoidTolls: boolean;
                    legStatus: number;
                }[];
                tripName: string;
            };
            _input_out: {
                assignedDriverId: string;
                legs: {
                    givenAddress: string;
                    fullAddressStr: string;
                    legDetails: {
                        name: string;
                        value: string;
                    }[];
                    avoidTolls: boolean;
                    legStatus: number;
                }[];
                tripName: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, void>;
    }>;
    hello: _trpc_server.CreateRouterInner<_trpc_server.RootConfig<{
        ctx: {
            req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
            res: express.Response<any, Record<string, any>>;
        };
        meta: object;
        errorShape: _trpc_server.DefaultErrorShape;
        transformer: typeof superjson.default;
    }>, {
        sayHello: _trpc_server.BuildProcedure<"query", {
            _config: _trpc_server.RootConfig<{
                ctx: {
                    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                    res: express.Response<any, Record<string, any>>;
                };
                meta: object;
                errorShape: _trpc_server.DefaultErrorShape;
                transformer: typeof superjson.default;
            }>;
            _meta: object;
            _ctx_out: {
                req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
                res: express.Response<any, Record<string, any>>;
            };
            _input_in: {
                hello: string;
            };
            _input_out: {
                hello: string;
            };
            _output_in: typeof _trpc_server.unsetMarker;
            _output_out: typeof _trpc_server.unsetMarker;
        }, string>;
    }>;
}>;
type AppRouter = typeof appRouter;

declare const createContext: ({ req, res }: trpcExpress.CreateExpressContextOptions) => Promise<{
    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
    res: express.Response<any, Record<string, any>>;
}>;

export { AppRouter, appRouter, createContext };
