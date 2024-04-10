import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UsersEntity } from "./users.model";
import { PlansEntity } from "./plans.model";

@Entity("Purchases")
export class PurchasesEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  pricePaid: string;

  @Column({ nullable: false, unique: true })
  trackCode: string;

  @Column({ nullable: false, type: Date })
  purchaseDate: Date;

  @Column({ nullable: false, enum: ["waiting", "paid", "cancelled"] })
  status: string;

  @CreateDateColumn()
  created_At: Date;

  @UpdateDateColumn()
  update_At: Date;

  @ManyToOne(() => UsersEntity, (user) => user.purhcases, { nullable: false })
  @JoinColumn({ name: "userId" })
  user: UsersEntity;

  @ManyToOne(() => PlansEntity, (plan) => plan.purhcases, { nullable: false })
  @JoinColumn({ name: "planId" })
  plan: PlansEntity;
}
