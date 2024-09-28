import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
} from "typeorm";

import { Credential } from "./credential";

@Entity()
export class User {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ type: "string" })
  username!: string;

  @Column(() => Credential, { array: true })
  credentials!: Credential[];

  @CreateDateColumn()
  createdAt!: string;
}
