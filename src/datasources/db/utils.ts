import { Connection, ObjectType } from 'typeorm';
import { CargoBike, Lockable } from '../../model/CargoBike';

export class LockUtils {
    static getToken (req: any) : string {
        return req.headers.authorization?.replace('Bearer ', '');
    }

    /**
     * locks any entity that implements Lockable
     */
    static async lockEntity (connection: Connection, target: ObjectType<Lockable>, alias: string, id: number, req: any, dataSources: any) {
        const token = this.getToken(req);
        const userId = await dataSources.userAPI.getUserId(token);
        const lock = await connection.getRepository(target)
            .createQueryBuilder(alias)
            .select([
                alias + '.lockedUntil',
                alias + '.lockedBy'
            ])
            .where('id = :id', {
                id: id
            })
            .andWhere(alias + '.lockedUntil > CURRENT_TIMESTAMP')
            .getOne();
        // eslint-disable-next-line eqeqeq
        if (!lock?.lockedUntil || lock?.lockedBy == userId) {
        // no lock -> set lock
            await connection.getRepository(target)
                .createQueryBuilder(alias)
                .update()
                .set({
                    lockedUntil: () => 'CURRENT_TIMESTAMP + INTERVAL \'10 MINUTE\'',
                    lockedBy: userId
                })
                .where('id = :id', { id: id })
                .execute();
            return true;
        } else {
        // lock was set
            return false;
        }
    }

    static async unlockEntity (connection: Connection, target: ObjectType<Lockable>, alias: string, id: number, req: any, dataSources: any) {
        const token = this.getToken(req);
        const userId = await dataSources.userAPI.getUserId(token);
        const lock = await connection.getRepository(target)
            .createQueryBuilder(alias)
            .select([
                alias + '.lockedUntil',
                alias + '.lockedBy'
            ])
            .where('id = :id', {
                id: id
            })
            .andWhere(alias + '.lockedUntil > CURRENT_TIMESTAMP')
            .getOne();
        if (!lock?.lockedUntil) {
            // no lock
            return true;
            // eslint-disable-next-line eqeqeq
        } else if (lock?.lockedBy == userId) {
            // user can unlock
            await connection.getRepository(target)
                .createQueryBuilder(alias)
                .update()
                .set({
                    lockedUntil: null,
                    lockedBy: null
                })
                .where('id = :id', { id: id })
                .execute();
            return true;
        } else {
            // entity is locked by other user
            return false;
        }
    }

    static async isLocked (connection: Connection, target: ObjectType<Lockable>, alias: string, id: number, req: any, dataSources: any) {
        const token = this.getToken(req);
        const userId = await dataSources.userAPI.getUserId(token);
        const lock = await connection.getRepository(CargoBike)
            .createQueryBuilder(alias)
            .select([
                alias + '.lockedUntil',
                alias + '.lockedBy'
            ])
            .where('id = :id', {
                id: id
            })
            .andWhere(alias + '.lockedUntil > CURRENT_TIMESTAMP')
            .getOne();
        if (!lock?.lockedUntil) {
            // no lock
            return false;
            // eslint-disable-next-line eqeqeq
        } else return lock?.lockedBy != userId;
    }
}
