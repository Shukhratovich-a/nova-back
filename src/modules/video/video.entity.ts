import {
  Entity,
  BaseEntity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Relation,
  AfterInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { LanguageEnum } from "@enums/language.enum";
import { StatusEnum } from "@enums/status.enum";

@Entity("videos")
export class VideoEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "status", type: "simple-enum", enum: StatusEnum, default: "active" })
  status: StatusEnum;

  @OneToMany(() => VideoContentEntity, (content) => content.video, { onDelete: "CASCADE" })
  contents: Relation<VideoContentEntity[]>;

  @CreateDateColumn({ name: "create_at", type: "datetime" })
  createAt: Date;

  @UpdateDateColumn({ name: "update_at", type: "datetime" })
  updateAt: Date;
}

@Entity("video_contents")
@Index(["language", "video"], { unique: true })
export class VideoContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "title", type: "varchar" })
  title: string;

  @Column({ name: "language", type: "simple-enum", enum: LanguageEnum })
  language: LanguageEnum;

  @ManyToOne(() => VideoEntity, (video) => video.contents, { nullable: false })
  @JoinColumn({ name: "video_id" })
  video: VideoEntity;
}
