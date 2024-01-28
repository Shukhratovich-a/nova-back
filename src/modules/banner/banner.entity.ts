import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  // CreateDateColumn,
  // UpdateDateColumn,
} from "typeorm";

import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

@Entity("banners")
export class BannerEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "poster", type: "varchar" })
  poster: string;

  @Column({ name: "status", type: "simple-enum", enum: StatusEnum, default: "active" })
  status: StatusEnum;

  @OneToMany(() => BannerContentEntity, (content) => content.banner, { onDelete: "CASCADE" })
  contents: Relation<BannerContentEntity[]>;

  // @CreateDateColumn({ name: "create_at", type: "datetime" })
  // createAt: Date;

  // @UpdateDateColumn({ name: "update_at", type: "datetime" })
  // updateAt: Date;
}

@Entity("banner_contents")
export class BannerContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "title", type: "varchar" })
  title: string;

  @Column({ name: "description", type: "varchar", nullable: true })
  description: string;

  @Column({ name: "subtitle", type: "varchar", nullable: true })
  subtitle: string;

  @Column({ name: "language", type: "simple-enum", enum: LanguageEnum })
  language: LanguageEnum;

  @ManyToOne(() => BannerEntity, (banner) => banner.contents, { nullable: false })
  @JoinColumn({ name: "banner_id" })
  banner: BannerEntity;
}
