import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, Relation, ManyToOne } from "typeorm";
import { UsersEntity } from "./users.model";

@Entity("FB_token")
export class FBTokensEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.fb_tokens, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "user_id" })
  user: Relation<UsersEntity>;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  Page_Id: string;

  @Column({ nullable: true })
  Page_AccessToken: string;

  @Column({ nullable: true })
  Page_AccessTokenExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
