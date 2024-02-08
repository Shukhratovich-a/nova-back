import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

import { StatusEnum } from "@enums/status.enum";

@Entity("certificates")
export class CertificateEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "title", type: "varchar" })
  title: string;

  @Column({ name: "poster", type: "varchar" })
  poster: string;

  @Column({ name: "certificate", type: "varchar" })
  certificate: string;

  @Column({ name: "status", type: "simple-enum", enum: StatusEnum, default: "active" })
  status: StatusEnum;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;
}
