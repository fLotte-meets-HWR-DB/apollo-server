import { DataSource } from 'apollo-datasource';
import { Connection, EntityManager, getConnection } from 'typeorm';
import { WorkshopType } from '../../model/WorkshopType';
import { Workshop } from '../../model/Workshop';
import { ActionLogger, LockUtils } from './utils';
import { UserInputError } from 'apollo-server-express';
import { GraphQLError } from 'graphql';

export class WorkshopAPI extends DataSource {
    connection: Connection

    constructor () {
        super();
        this.connection = getConnection();
    }

    async createWorkshop (workshop: any) {
        const inserts = await this.connection.getRepository(Workshop)
            .createQueryBuilder('w')
            .insert()
            .values([workshop])
            .returning('*')
            .execute();
        return inserts.generatedMaps[0];
    }

    async lockWorkshop (id: number, userId: number) {
        return await LockUtils.lockEntity(this.connection, Workshop, 'w', id, userId);
    }

    async unlockWorkshop (id: number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, Workshop, 'w', id, userId);
    }

    async updateWorkshop (workshop: any, userId: number) {
        const keepLock = workshop.keepLock;
        delete workshop.keepLock;
        await this.connection.transaction(async (entityManger: EntityManager) => {
            if (await LockUtils.isLocked(entityManger, Workshop, 'w', workshop.id, userId)) {
                throw new UserInputError('Attempting to update locked resource');
            }
            await ActionLogger.log(entityManger, Workshop, 'w', workshop, userId);
            await entityManger.getRepository(Workshop)
                .createQueryBuilder('w')
                .update()
                .set({ ...workshop })
                .where('id = :id', { id: workshop.id })
                .execute()
                .then(value => { if (value.affected !== 1) { throw new GraphQLError('ID not found'); } });
        });
        !keepLock && await this.unlockWorkshop(workshop.id, userId);
        return await this.workshopById(workshop.id);
    }

    async createWorkshopType (workshopType: any) {
        const inserts = await this.connection.getRepository(WorkshopType)
            .createQueryBuilder('wt')
            .insert()
            .values([workshopType])
            .returning('*')
            .execute();
        return inserts.generatedMaps[0];
    }

    async lockWorkshopType (id: number, userId: number) {
        return await LockUtils.lockEntity(this.connection, WorkshopType, 'wt', id, userId);
    }

    async unlockWorkshopType (id: number, userId: number) {
        return await LockUtils.unlockEntity(this.connection, WorkshopType, 'wt', id, userId);
    }

    async updateWorkshopType (workshopType : any, userId: number) {
        const keepLock = workshopType.keepLock;
        delete workshopType.keepLock;
        await this.connection.transaction(async (entityManager: EntityManager) => {
            if (await LockUtils.isLocked(entityManager, WorkshopType, 'wt', workshopType.id, userId)) {
                throw new UserInputError('Attempting to update locked resource');
            }
            await ActionLogger.log(entityManager, WorkshopType, 'wt', workshopType, userId);
            await entityManager.getRepository(WorkshopType)
                .createQueryBuilder('wt')
                .update()
                .set({ ...workshopType })
                .where('id = :id', { id: workshopType.id })
                .execute()
                .then(value => { if (value.affected !== 1) { throw new GraphQLError('ID not found'); } });
        });
        !keepLock && await this.unlockWorkshopType(workshopType.id, userId);
        return await this.workshopTypeById(workshopType.id);
    }

    async workshopTypeById (id: number) {
        return await this.connection.getRepository(WorkshopType)
            .createQueryBuilder('wt')
            .select()
            .where('id = :id', { id: id })
            .getOne();
    }

    async workshopTypes (offset: number, limit: number) {
        return await this.connection.getRepository(WorkshopType)
            .createQueryBuilder('w')
            .select()
            .skip(offset)
            .take(limit)
            .getMany();
    }

    async workshopById (id: number) {
        return await this.connection.getRepository(Workshop)
            .createQueryBuilder('w')
            .select()
            .where('id = :id', { id: id })
            .getOne();
    }

    /**
     * finds workshops with pagination
     * @param offset
     * @param limit
     */
    async workshops (offset: number, limit: number) {
        return await this.connection.getRepository(Workshop)
            .createQueryBuilder('w')
            .select()
            .skip(offset)
            .take(limit)
            .getMany();
    }

    async trainer1ByWorkshopId (id: number) {
        return await this.connection.getRepository(Workshop)
            .createQueryBuilder('w')
            .relation(Workshop, 'trainer1Id')
            .of(id)
            .loadOne();
    }

    async trainer2ByWorkshopId (id: number) {
        return await this.connection.getRepository(Workshop)
            .createQueryBuilder('w')
            .relation(Workshop, 'trainer2Id')
            .of(id)
            .loadOne();
    }
}
