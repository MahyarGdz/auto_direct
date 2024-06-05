import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { SubscriptionsEntity } from "./subscriptions.model";
import { PurchasesEntity } from "./purhcases.model";
import { RefTokensEntity } from "./RefTokens.model";
import { FBPagesEntity } from "./FbPages.model";
import { IGCommentEntity } from "./igComment.model";

@Entity("users")
export class UsersEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  fullname!: string;

  @Column({ nullable: true, unique: true })
  email!: string;

  @Column({ nullable: true, unique: true })
  profile_pic: string;

  @Column({ nullable: false, unique: true })
  phone!: string;

  @Column({ nullable: true, unique: true })
  googleid!: string;

  @Column({ nullable: true, unique: true })
  facebookId!: string;

  @Column({ nullable: true })
  FBAccessToken!: string;

  @CreateDateColumn()
  created_At!: Date;

  @UpdateDateColumn()
  update_At!: Date;

  @OneToOne(() => RefTokensEntity, (ref_token) => ref_token.user)
  ref_token!: Relation<RefTokensEntity>;

  @OneToMany(() => FBPagesEntity, (fb_page) => fb_page.user)
  fb_tokens!: Array<Relation<FBPagesEntity>>;

  @OneToMany(() => SubscriptionsEntity, (subscription) => subscription.user)
  subscriptions!: Array<Relation<SubscriptionsEntity>>;

  @OneToMany(() => PurchasesEntity, (purchase) => purchase.user)
  purchases!: Array<Relation<PurchasesEntity>>;

  @OneToMany(() => IGCommentEntity, (ig_comment) => ig_comment.user)
  ig_comment!: Array<Relation<IGCommentEntity>>;
}
