import { Wallet } from '../../wallets/entities/wallet.entity';
export declare class Transaction {
    id: string;
    referenceNo: string;
    senderWalletId: string;
    senderWallet: Wallet;
    receiverWalletId: string;
    receiverWallet: Wallet;
    amount: number;
    fee: number;
    transactionType: string;
    status: string;
    createdAt: Date;
}
