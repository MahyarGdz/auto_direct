import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, Relation, OneToOne } from "typeorm";
import { UsersEntity } from "./users.model";

@Entity("ref_tokens")
export class RefTokensEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => UsersEntity, (user) => user.ref_token, { eager: true, onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "user_id" })
  user: Relation<UsersEntity>;

  @Column({ nullable: false })
  refreshToken: string;

  @Column({ nullable: false })
  refreshTokenExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
