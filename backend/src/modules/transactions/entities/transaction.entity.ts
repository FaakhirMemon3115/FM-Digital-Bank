import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reference_no', unique: true })
  referenceNo: string;

  @Column({ name: 'sender_wallet_id', nullable: true })
  senderWalletId: string;

  @ManyToOne(() => Wallet, wallet => wallet.sentTransactions, { nullable: true })
  @JoinColumn({ name: 'sender_wallet_id' })
  senderWallet: Wallet;

  @Column({ name: 'receiver_wallet_id', nullable: true })
  receiverWalletId: string;

  @ManyToOne(() => Wallet, wallet => wallet.receivedTransactions, { nullable: true })
  @JoinColumn({ name: 'receiver_wallet_id' })
  receiverWallet: Wallet;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  fee: number;

  @Column({ name: 'transaction_type' }) // deposit, withdrawal, transfer, payment
  transactionType: string;

  @Column({ default: 'pending' }) // pending, completed, failed
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
