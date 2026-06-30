import { WalletsService } from './wallets.service';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    getMyWallet(req: any): Promise<import("./entities/wallet.entity").Wallet>;
    getBalance(req: any): Promise<{
        balance: number;
        currency: string;
        walletNumber: string;
    }>;
    deposit(req: any, body: {
        amount: number;
        description?: string;
    }): Promise<{
        message: string;
        newBalance: number;
        transaction: {
            referenceNo: string;
            amount: number;
            type: string;
            status: string;
        };
    }>;
    sendMoney(req: any, body: {
        toWalletNumber: string;
        amount: number;
        description?: string;
    }): Promise<{
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
    getMyTransactions(req: any): Promise<{
        direction: string;
        amount: number;
        id: string;
        referenceNo: string;
        senderWalletId: string;
        senderWallet: import("./entities/wallet.entity").Wallet;
        receiverWalletId: string;
        receiverWallet: import("./entities/wallet.entity").Wallet;
        fee: number;
        transactionType: string;
        status: string;
        description: string;
        createdAt: Date;
    }[]>;
}
