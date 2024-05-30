import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, Relation, OneToOne } from "typeorm";
import { UsersEntity } from "./users.model";

@Entity("FB_token")
export class FBTokensEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => UsersEntity, (user) => user.fb_token, { eager: true, onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "user_id" })
  user: Relation<UsersEntity>;

  @Column({ nullable: true })
  U_FbAccessToken: string;

  @Column({ nullable: true })
  U_FbAccessTokenExpires: Date;

  //   @Column({ nullable: true })
  //   pageAccessToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
