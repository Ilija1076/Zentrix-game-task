import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity()
export class Duel{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    characterAId!: number;
    
    @Column()
    characterBId!: number;

    @Column()
    currentTurnCharId!: number;
   
    @Column({ type: "int" })
    characterAHealth!: number;

    @Column({ type: "int" })
    characterBHealth!: number;

    @Column({ type: "int" })
    characterAMana!: number;

    @Column({ type: "int" })
    characterBMana!: number;

    @Column({type: "varchar", nullable: true})
    winnerId!: number | null;
    
    @Column({type: "varchar", nullable: true})
    isDraw!: boolean;

    @CreateDateColumn()
    startTime!: Date;

    @Column({type: "timestamp", nullable: true})
    endTime!: Date | null;
}