import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

import { ContactTypeEnum } from "@enums/contact-type.enum";

@Entity("contacts")
export class ContactEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "address", type: "varchar" })
  address: string;

  @Column({ name: "phone", type: "varchar", nullable: true })
  phone: string;

  @Column({ name: "email", type: "varchar", nullable: true })
  email: string;

  @Column({ name: "type", type: "simple-enum", enum: ContactTypeEnum })
  type: ContactTypeEnum;

  @Column({ name: "country", type: "varchar" })
  country: string;

  @Column({ name: "city", type: "varchar", nullable: true })
  city: string;

  @Column({ name: "map", type: "varchar", nullable: true })
  map: string;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;

  @DeleteDateColumn({ name: "delete_at", type: "datetime", nullable: true })
  deleteAt: Date;
}
