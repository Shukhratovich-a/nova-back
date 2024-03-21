import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

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

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;

  @DeleteDateColumn({ name: "delete_at", type: "datetime", nullable: true })
  deleteAt: Date;
}
