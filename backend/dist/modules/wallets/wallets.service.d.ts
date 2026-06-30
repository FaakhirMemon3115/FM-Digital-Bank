import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { User } from '../users/entities/user.entity';
export declare class WalletsService {
    private walletRepository;
    private transactionRepository;
    private userRepository;
    constructor(walletRepository: Repository<Wallet>, transactionRepository: Repository<Transaction>, userRepository: Repository<User>);
    getMyWallet(userId: string): Promise<Wallet>;
    getBalance(userId: string): Promise<{
        balance: number;
        currency: string;
        walletNumber: string;
    }>;
    deposit(userId: string, amount: number, description?: string): Promise<{
        message: string;
        newBalance: number;
        transaction: {
            referenceNo: string;
            amount: number;
            type: string;
            status: string;
        };
    }>;
    sendMoney(senderUserId: string, toWalletNumber: string, amount: number, description?: string): Promise<{
        message: string;
        newBalance: number;
        transaction: {
            referenceNo: string;
            amount: number;
            to: string;
            type: string;
            status: string;
        };
    }>;
    getMyTransactions(userId: string): Promise<{
        direction: string;
        amount: number;
        id: string;
        referenceNo: string;
        senderWalletId: string;
        senderWallet: Wallet;
        receiverWalletId: string;
        receiverWallet: Wallet;
        fee: number;
        transactionType: string;
        status: string;
        description: string;
        createdAt: Date;
    }[]>;
}
