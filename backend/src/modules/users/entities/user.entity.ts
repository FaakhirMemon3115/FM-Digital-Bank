import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ default: 'active' }) // active, suspended, etc.
  status: string;

  @Column({ name: 'kyc_status', default: 'pending' }) // pending, approved, rejected
  kycStatus: string;

  @Column({ default: 'customer' }) // customer, agent, merchant, admin
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Wallet, wallet => wallet.user)
  wallets: Wallet[];
}
