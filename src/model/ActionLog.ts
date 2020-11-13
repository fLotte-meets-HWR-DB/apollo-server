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

/* eslint no-unused-vars: "off" */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Actions {
    UPDATE='UPDATE',
    SOFT_DELETE='SOFT_DELETE',
    DELETE='DELETE',
    RESTORE='RESTORE',
}

@Entity()
export class ActionLog {
    @PrimaryGeneratedColumn()
    id?: number;

    @CreateDateColumn()
    date?: Date;

    @Column()
    action: string;

    @Column()
    userId: number;

    @Column()
    entity: string;

    @Column({
        type: 'text'
    })
    entriesOld: string;

    @Column({
        type: 'text'
    })
    entriesNew: string;
}
