import { Permission } from '../datasources/userserver/permission';
import { GraphQLError } from 'graphql';

export default {
    Query: {
        workshopTypes: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.workshopAPI.workshopTypes(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        workshops: (_: any, { offset, limit }: { offset: number, limit: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadBike)) {
                return dataSources.workshopAPI.workshops(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    Workshop: {
        trainer1: (parent: any, __:any, { dataSources, req }: { dataSources: any, req: any }) => {
            return dataSources.workshopAPI.trainer1ByWorkshopId(parent.id);
        },
        trainer2: (parent: any, __:any, { dataSources, req }: { dataSources: any, req: any }) => {
            return dataSources.workshopAPI.trainer2ByWorkshopId(parent.id);
        }
    },
    Mutation: {
        createWorkshop: (_: any, { workshop }: { workshop: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshopType)) {
                return dataSources.workshopAPI.createWorkshop(workshop);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createWorkshopType: (_: any, { workshopType }: { workshopType: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WriteWorkshopType)) {
                return dataSources.workshopAPI.createWorkshopType(workshopType);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
