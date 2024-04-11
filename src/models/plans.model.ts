import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { SubscriptionsEntity } from "./subscriptions.model";
import { PurchasesEntity } from "./purhcases.model";

@Entity("plans")
export class PlansEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  price: string;

  @Column({ nullable: false, type: "timestamp" })
  duration: Date;

  @CreateDateColumn()
  created_At: Date;

  @UpdateDateColumn()
  update_At: Date;

  @OneToMany(() => SubscriptionsEntity, (subscription) => subscription.plan)
  subscriptions: Array<Relation<SubscriptionsEntity>>;

  @OneToMany(() => PurchasesEntity, (purchase) => purchase.plan)
  purchases: Array<Relation<PurchasesEntity>>;
}
