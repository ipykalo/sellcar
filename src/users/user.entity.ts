import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert(): void {
    console.log(`Inserted a user with id: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate(): void {
    console.log(`Updated a user with id: ${this.id}`);
  }

  @AfterRemove()
  logremove(): void {
    console.log(`Removed a user with id: ${this.id}`);
  }
}