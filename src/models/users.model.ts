import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { SubscriptionsEntity } from "./subscriptions.model";
import { PurchasesEntity } from "./purhcases.model";
import { RefTokensEntity } from "./RefTokens.model";
import { FBTokensEntity } from "./FbTokens.model";

@Entity("users")
export class UsersEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  fullname!: string;

  @Column({ nullable: false, unique: true })
  phone!: string;

  @Column({ nullable: true, unique: true })
  googleid!: string;

  @Column({ nullable: true, unique: true })
  facebookId!: string;

  @CreateDateColumn()
  created_At!: Date;

  @UpdateDateColumn()
  update_At!: Date;

  @OneToOne(() => RefTokensEntity, (ref_token) => ref_token.user)
  ref_token: Relation<RefTokensEntity>;

  @OneToOne(() => FBTokensEntity, (fb_token) => fb_token.user)
  fb_token: Relation<FBTokensEntity>;

  @OneToMany(() => SubscriptionsEntity, (subscription) => subscription.user)
  subscriptions: Array<Relation<SubscriptionsEntity>>;

  @OneToMany(() => PurchasesEntity, (purchase) => purchase.user)
  purchases: Array<Relation<PurchasesEntity>>;
}
