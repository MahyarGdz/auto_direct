import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { SubscriptionsEntity } from "./subscriptions.model";
import { PurchasesEntity } from "./purhcases.model";

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

  @OneToMany(() => SubscriptionsEntity, (subscription) => subscription.user)
  subscriptions: Array<Relation<SubscriptionsEntity>>;

  @OneToMany(() => PurchasesEntity, (purchase) => purchase.user)
  purchases: Array<Relation<PurchasesEntity>>;
}
