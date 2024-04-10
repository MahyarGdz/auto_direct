import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.model";
import { PlansEntity } from "./plans.model";

@Entity("subscriptions")
export class SubscriptionsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @ManyToOne(() => UsersEntity, (user) => user.subscriptions, { nullable: false })
  @JoinColumn({ name: "userId" })
  user: UsersEntity;
  @ManyToOne(() => PlansEntity, (plan) => plan.subscriptions, { nullable: false })
  @JoinColumn({ name: "planId" })
  plan: PlansEntity;
  @Column({ nullable: false })
  start_date: Date;
  @Column({ nullable: false })
  end_date: Date;
  @Column({ nullable: false, enum: ["active", "expired"] })
  status: string;
  @CreateDateColumn()
  created_At: Date;
}
