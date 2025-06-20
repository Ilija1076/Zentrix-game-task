import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Character } from "./Character";

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  description!: string;

  @OneToMany(() => Character, (character) => character.class)
  characters!: Character[];
}