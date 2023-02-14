import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @Column('text')
    title: string;

    @Column('integer')
    width: number;

    @Column('integer')
    height: number;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @DeleteDateColumn()
    deletedAt: string;
}
