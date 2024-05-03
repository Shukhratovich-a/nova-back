import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

import { ContactTypeEnum } from "@enums/contact-type.enum";

@Entity("contacts")
export class ContactEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "company_en", type: "varchar", nullable: true })
  companyEn: string;

  @Column({ name: "company_ru", type: "varchar", nullable: true })
  companyRu: string;

  @Column({ name: "company_tr", type: "varchar", nullable: true })
  companyTr: string;

  @Column({ name: "company_ar", type: "varchar", nullable: true })
  companyAr: string;

  @Column({ name: "address_en", type: "varchar", nullable: true })
  addressEn: string;

  @Column({ name: "address_ru", type: "varchar", nullable: true })
  addressRu: string;

  @Column({ name: "address_tr", type: "varchar", nullable: true })
  addressTr: string;

  @Column({ name: "address_ar", type: "varchar", nullable: true })
  addressAr: string;

  @Column({ name: "phone", type: "varchar", nullable: true })
  phone: string;

  @Column({ name: "email", type: "varchar", nullable: true })
  email: string;

  @Column({ name: "type", type: "simple-enum", enum: ContactTypeEnum })
  type: ContactTypeEnum;

  @Column({ name: "country_en", type: "varchar", nullable: true })
  countryEn: string;

  @Column({ name: "country_ru", type: "varchar", nullable: true })
  countryRu: string;

  @Column({ name: "country_tr", type: "varchar", nullable: true })
  countryTr: string;

  @Column({ name: "country_ar", type: "varchar", nullable: true })
  countryAr: string;

  @Column({ name: "map", type: "varchar", nullable: true })
  map: string;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;
}
