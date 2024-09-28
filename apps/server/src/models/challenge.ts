import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
} from "typeorm";

@Entity()
export class Challenge {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  challenge!: string;

  @CreateDateColumn()
  createdAt!: string;
}
