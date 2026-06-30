import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getMyWallet(userId: string) {
    const wallet = await this.walletRepository.findOne({
      where: { userId },
      relations: { user: true },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async getBalance(userId: string) {
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return { balance: Number(wallet.balance), currency: wallet.currency, walletNumber: wallet.walletNumber };
  }

  // Deposit: apne wallet mein amount dalna
  async deposit(userId: string, amount: number, description?: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be greater than 0');
    if (amount > 1000000) throw new BadRequestException('Maximum deposit amount is 1,000,000');

    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.status !== 'active') throw new BadRequestException('Wallet is not active');

    // Update balance
    const newBalance = Number(wallet.balance) + amount;
    await this.walletRepository.update(wallet.id, { balance: newBalance });

    // Create transaction record
    const refNo = 'DEP-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    const transaction = this.transactionRepository.create({
      referenceNo: refNo,
      receiverWalletId: wallet.id,
      amount,
      fee: 0,
      transactionType: 'deposit',
      status: 'completed',
      description: description || 'Self deposit',
    });
    await this.transactionRepository.save(transaction);

    return {
      message: 'Amount deposited successfully',
      newBalance,
      transaction: {
        referenceNo: refNo,
        amount,
        type: 'deposit',
        status: 'completed',
      },
    };
  }

  // Send money to another wallet
  async sendMoney(senderUserId: string, toWalletNumber: string, amount: number, description?: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be greater than 0');

    const senderWallet = await this.walletRepository.findOne({ where: { userId: senderUserId } });
    if (!senderWallet) throw new NotFoundException('Your wallet not found');
    if (senderWallet.status !== 'active') throw new BadRequestException('Your wallet is not active');

    if (senderWallet.walletNumber === toWalletNumber) {
      throw new BadRequestException('Cannot send money to your own wallet');
    }

    if (Number(senderWallet.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const receiverWallet = await this.walletRepository.findOne({ where: { walletNumber: toWalletNumber } });
    if (!receiverWallet) throw new NotFoundException('Recipient wallet not found');
    if (receiverWallet.status !== 'active') throw new BadRequestException('Recipient wallet is not active');

    // Deduct from sender
    const newSenderBalance = Number(senderWallet.balance) - amount;
    await this.walletRepository.update(senderWallet.id, { balance: newSenderBalance });

    // Add to receiver
    const newReceiverBalance = Number(receiverWallet.balance) + amount;
    await this.walletRepository.update(receiverWallet.id, { balance: newReceiverBalance });

    // Create transaction record
    const refNo = 'TRF-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    const transaction = this.transactionRepository.create({
      referenceNo: refNo,
      senderWalletId: senderWallet.id,
      receiverWalletId: receiverWallet.id,
      amount,
      fee: 0,
      transactionType: 'transfer',
      status: 'completed',
      description: description || 'Money transfer',
    });
    await this.transactionRepository.save(transaction);

    return {
      message: 'Money sent successfully',
      newBalance: newSenderBalance,
      transaction: {
        referenceNo: refNo,
        amount,
        to: toWalletNumber,
        type: 'transfer',
        status: 'completed',
      },
    };
  }

  async getMyTransactions(userId: string) {
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const transactions = await this.transactionRepository.find({
      where: [
        { senderWalletId: wallet.id },
        { receiverWalletId: wallet.id },
      ],
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return transactions.map(tx => ({
      ...tx,
      direction: tx.receiverWalletId === wallet.id ? 'credit' : 'debit',
      amount: Number(tx.amount),
    }));
  }
}
