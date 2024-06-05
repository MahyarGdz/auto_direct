import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, Relation, ManyToOne } from "typeorm";
import { UsersEntity } from "./users.model";

@Entity("IG-Comment")
export class IGCommentEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false }) // unique : true ?
  post_id: string;

  @Column({ nullable: false })
  key_word: string;

  @Column({ nullable: false })
  message: string;

  @ManyToOne(() => UsersEntity, (user) => user.ig_comment, { eager: true, nullable: false })
  @JoinColumn({ name: "user_id" })
  user: Relation<UsersEntity>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
