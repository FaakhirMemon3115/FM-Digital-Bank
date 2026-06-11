import { Wallet } from '../../wallets/entities/wallet.entity';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passwordHash: string;
    status: string;
    kycStatus: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    wallets: Wallet[];
}
