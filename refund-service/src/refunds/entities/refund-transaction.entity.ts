import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum RefundStatus {
  REFUND_PENDING = 'REFUND_PENDING',
  REFUND_PROCESSING = 'REFUND_PROCESSING',
  REFUNDED = 'REFUNDED',
  REFUND_FAILED = 'REFUND_FAILED',
}

@Entity({ name: 'refund_transactions' })
export class RefundTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64, unique: true })
  transactionId: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number): number => value,
      from: (value: string | number): number =>
        typeof value === 'string' ? parseFloat(value) : value,
    },
  })
  amount: number;

  @Index()
  @Column({
    type: 'varchar',
    length: 32,
    default: RefundStatus.REFUND_PENDING,
  })
  status: RefundStatus;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'timestamp with time zone', nullable: true, default: null })
  lastAttempt: Date | null;

  @Column({ type: 'varchar', length: 128, nullable: true, default: null })
  providerRefundId: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
