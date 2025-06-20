import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Class } from "./Class";
import { Item } from "./Item";

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  health!: number;

  @Column()
  mana!: number;

  @Column()
  baseStrength!: number;

  @Column()
  baseAgility!: number;

  @Column()
  baseIntelligence!: number;

  @Column()
  baseFaith!: number;

  @ManyToOne(() => Class, (cls) => cls.characters)
  class!: Class;

  @ManyToMany(() => Item)
  @JoinTable()
  items!: Item[];

  @Column()
  createdBy!: number; 
}