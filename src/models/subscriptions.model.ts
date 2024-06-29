import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { UsersEntity } from "./users.model";
import { PlansEntity } from "./plans.model";
import { SubStatus } from "../common/enums/status.enum";

@Entity("subscriptions")
export class SubscriptionsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.subscriptions, { nullable: false })
  @JoinColumn({ name: "userId" })
  user: Relation<UsersEntity>;

  @ManyToOne(() => PlansEntity, (plan) => plan.subscriptions, { nullable: false })
  @JoinColumn({ name: "planId" })
  plan: Relation<PlansEntity>;

  @Column({ nullable: false })
  start_date: Date;

  @Column({ nullable: false })
  end_date: Date;

  @Column({ type: "enum", enum: SubStatus, default: SubStatus.Active })
  status: SubStatus;

  @CreateDateColumn()
  created_At: Date;
}
