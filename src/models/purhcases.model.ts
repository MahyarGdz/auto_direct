import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
} from "typeorm";
import { UsersEntity } from "./users.model";
import { PlansEntity } from "./plans.model";
import { PurchaseStatus } from "../common/enums/status.enum";

@Entity("purchases")
export class PurchasesEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  pricePaid: string;

  @Column({ nullable: false, unique: true })
  trackCode: string;

  @Column({ nullable: false, type: Date })
  purchaseDate: Date;

  @Column({ type: "enum", enum: PurchaseStatus, default: PurchaseStatus.Waiting })
  status: PurchaseStatus;

  @CreateDateColumn()
  created_At: Date;

  @UpdateDateColumn()
  update_At: Date;

  @ManyToOne(() => UsersEntity, (user) => user.purchases, { nullable: false })
  @JoinColumn({ name: "userId" })
  user: Relation<UsersEntity>;

  @ManyToOne(() => PlansEntity, (plan) => plan.purchases, { nullable: false })
  @JoinColumn({ name: "planId" })
  plan: Relation<PlansEntity>;
}
