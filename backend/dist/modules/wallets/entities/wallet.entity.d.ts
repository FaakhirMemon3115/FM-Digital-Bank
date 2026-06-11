import { User } from '../../users/entities/user.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
export declare class Wallet {
    id: string;
    userId: string;
    user: User;
    walletNumber: string;
    balance: number;
    currency: string;
    status: string;
    createdAt: Date;
    sentTransactions: Transaction[];
    receivedTransactions: Transaction[];
}
