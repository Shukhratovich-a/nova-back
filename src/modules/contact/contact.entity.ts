import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { StatusEnum } from "@enums/status.enum";
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

  @Column({ name: "status", type: "simple-enum", enum: StatusEnum, default: "active" })
  status: StatusEnum;

  @OneToOne(() => CoordEntity, (map) => map.contact, { onDelete: "CASCADE" })
  coord: Relation<CoordEntity>;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;
}

@Entity("coords")
export class CoordEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "longitude", type: "varchar" })
  longitude: string;

  @Column({ name: "latitude", type: "varchar" })
  latitude: string;

  @OneToOne(() => ContactEntity, (contact) => contact.coord, { onDelete: "CASCADE" })
  @JoinColumn()
  contact: Relation<ContactEntity>;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;
}
