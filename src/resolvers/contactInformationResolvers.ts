/*
Copyright (C) 2020  Leon Löchner

This file is part of fLotte-API-Server.

    fLotte-API-Server is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    fLotte-API-Server is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with fLotte-API-Server.  If not, see <https://www.gnu.org/licenses/>.
*/

import { GraphQLError } from 'graphql';
import { Permission } from '../datasources/userserver/permission';
import { Person } from '../model/Person';
import { isLocked, isLockedByMe } from '../datasources/db/utils';

export default {
    Query: {
        contactInformation: (_: any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.contactInformation(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        contactInformationById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.contactInformationById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        personById: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.personById(id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        persons: (_: any, { offset, limit }: { offset?: number, limit?: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.persons(offset, limit);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    },
    Person: {
        contactInformation: (parent: Person, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.contactInformationByPersonId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    ContactInformation: {
        person: (parent: any, __: any, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.ReadPerson)) {
                return dataSources.contactInformationAPI.personByContactInformationId(parent.id);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        isLockedByMe: (parent: any, __: any, { req }: { req: any }) => isLockedByMe(parent, { req }),
        isLocked: (parent: any, __: any, { req }: { req: any }) => isLocked(parent, { req })
    },
    Mutation: {
        createPerson: (_: any, { person }: { person: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WritePerson)) {
                return dataSources.contactInformationAPI.createPerson(person);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockPerson: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WritePerson)) {
                return dataSources.contactInformationAPI.lockPerson(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockPerson: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WritePerson)) {
                return dataSources.contactInformationAPI.unlockPerson(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updatePerson: (_: any, { person }: { person: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WritePerson)) {
                return dataSources.contactInformationAPI.updatePerson(person, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        deletePerson: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeletePerson)) {
                return dataSources.contactInformationAPI.deletePerson(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        createContactInformation: (_: any, { contactInformation }: { contactInformation: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WritePerson)) {
                return dataSources.contactInformationAPI.createContactInformation(contactInformation);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        lockContactInformation: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WritePerson)) {
                return dataSources.contactInformationAPI.lockContactInformation(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        unlockContactInformation: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WritePerson)) {
                return dataSources.contactInformationAPI.unlockContactInformation(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        updateContactInformation: (_: any, { contactInformation }: { contactInformation: any }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.WritePerson)) {
                return dataSources.contactInformationAPI.updateContactInformation(contactInformation, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        },
        deleteContactInformation: (_: any, { id }: { id: number }, { dataSources, req }: { dataSources: any, req: any }) => {
            if (req.permissions.includes(Permission.DeletePerson)) {
                return dataSources.contactInformationAPI.deleteContactInformation(id, req.userId);
            } else {
                return new GraphQLError('Insufficient Permissions');
            }
        }
    }
};
